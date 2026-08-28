import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProcurementService {
  constructor(private readonly prisma: PrismaService) {}

  async getSuppliers(companyId: string) {
    return this.prisma.supplier.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
  }

  async createSupplier(companyId: string, data: any) {
    return this.prisma.supplier.create({ data: { ...data, companyId } });
  }

  async deleteSupplier(id: string) {
    return this.prisma.supplier.delete({ where: { id } });
  }

  async getRawMaterials(companyId: string) {
    return this.prisma.rawMaterial.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
  }

  async createRawMaterial(companyId: string, data: any) {
    return this.prisma.rawMaterial.create({ data: { ...data, companyId } });
  }

  async deleteRawMaterial(id: string) {
    return this.prisma.rawMaterial.delete({ where: { id } });
  }

  async deletePurchaseOrder(id: string) {
    return this.prisma.purchaseOrder.delete({ where: { id } });
  }

  async getPurchaseOrders(companyId: string) {
    return this.prisma.purchaseOrder.findMany({
      where: { companyId },
      include: { supplier: true, items: { include: { rawMaterial: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPurchaseOrder(companyId: string, data: { supplierId: string; expectedDeliveryDate?: string; items: { rawMaterialId: string; quantity: number; unitPrice: number }[] }) {
    if (!data.items?.length) throw new BadRequestException('A purchase order needs at least one item');
    const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const count = await this.prisma.purchaseOrder.count();
    const poNumber = `PO-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    return this.prisma.purchaseOrder.create({
      data: {
        poNumber,
        companyId,
        supplierId: data.supplierId,
        totalAmount,
        expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null,
        items: { create: data.items.map((item) => ({ rawMaterialId: item.rawMaterialId, quantity: item.quantity, unitPrice: item.unitPrice, totalPrice: item.quantity * item.unitPrice })) },
      },
      include: { supplier: true, items: true },
    });
  }

  async approvePurchaseOrder(companyId: string, id: string) {
    const order = await this.prisma.purchaseOrder.findFirst({ where: { id, companyId } });
    if (!order) throw new BadRequestException('Purchase order not found');
    if (order.status !== 'DRAFT') throw new BadRequestException('Only draft purchase orders can be approved');
    return this.prisma.purchaseOrder.update({ where: { id }, data: { status: 'APPROVED' } });
  }

  async receivePurchaseOrder(companyId: string, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.purchaseOrder.findFirst({
        where: { id, companyId },
        include: { supplier: true, items: { include: { rawMaterial: true } } },
      });
      if (!order) throw new BadRequestException('Purchase order not found');
      if (order.status !== 'APPROVED') throw new BadRequestException('Only approved purchase orders can be received');

      for (const item of order.items) {
        await tx.rawMaterial.update({
          where: { id: item.rawMaterialId },
          data: { currentStock: { increment: item.quantity } },
        });
        await tx.stockMovement.create({
          data: {
            type: 'PO_RECEIPT', reference: order.poNumber, itemType: 'RAW_MATERIAL',
            itemId: item.rawMaterialId, quantity: item.quantity,
            notes: `Received from ${order.supplier.name}`,
          },
        });
      }
      return tx.purchaseOrder.update({ where: { id }, data: { status: 'RECEIVED' } });
    });
  }
}
