import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductionService {
  constructor(private readonly prisma: PrismaService) {}

  async getTanks(companyId: string) {
    return this.prisma.storageTank.findMany({ where: { companyId }, orderBy: { tankNumber: 'asc' } });
  }

  async createTank(companyId: string, data: { tankNumber: string; capacityLiters: number; oilType: string }) {
    return this.prisma.storageTank.create({ data: { ...data, companyId } });
  }

  async updateTank(id: string, data: any) {
    return this.prisma.storageTank.update({ where: { id }, data });
  }

  async deleteTank(id: string) {
    return this.prisma.storageTank.delete({ where: { id } });
  }

  async getBatches(companyId: string) {
    return this.prisma.productionBatch.findMany({ where: { companyId }, include: { tank: true }, orderBy: { createdAt: 'desc' } });
  }

  async createBatch(companyId: string, data: { productName: string; plannedQty: number; tankId?: string; bomId?: string }) {
    const count = await this.prisma.productionBatch.count();
    const batchNumber = `BATCH-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
    if (data.bomId && !await this.prisma.billOfMaterials.findFirst({ where: { id: data.bomId, companyId, isActive: true } })) throw new BadRequestException('Active BOM not found');
    return this.prisma.productionBatch.create({ data: { batchNumber, productName: data.productName, plannedQty: data.plannedQty, tankId: data.tankId || null, bomId: data.bomId || null, companyId } });
  }

  async updateBatchStatus(id: string, status: any, actualQty?: number) {
    return this.prisma.productionBatch.update({ where: { id }, data: { status, ...(actualQty ? { actualQty } : {}) } });
  }

  async completeBatch(
    companyId: string,
    id: string,
    data: { finishedProductId: string; actualQty: number; rawMaterialId?: string; materialQty?: number },
  ) {
    if (!data.finishedProductId || !data.actualQty || data.actualQty <= 0) {
      throw new BadRequestException('Finished product and a positive output quantity are required');
    }
    return this.prisma.$transaction(async (tx) => {
      const batch = await tx.productionBatch.findFirst({ where: { id, companyId }, include: { bom: { include: { items: true } } } });
      if (!batch) throw new BadRequestException('Production batch not found');
      if (batch.status === 'COMPLETED' || batch.status === 'CANCELLED') {
        throw new BadRequestException('This production batch can no longer be completed');
      }
      const product = await tx.finishedProduct.findFirst({ where: { id: data.finishedProductId, companyId } });
      if (!product) throw new BadRequestException('Finished product not found');

      const productionAccounts = [
        { code: '1500', name: 'Raw Material Inventory', type: 'ASSET' },
        { code: '1700', name: 'Finished Goods Inventory', type: 'ASSET' },
        { code: '5100', name: 'Production Clearing', type: 'EXPENSE' },
      ];

      for (const account of productionAccounts) {
        await tx.chartOfAccount.upsert({
          where: { companyId_code: { companyId, code: account.code } },
          update: {},
          create: { companyId, ...account },
        });
      }

      const accounts = await tx.chartOfAccount.findMany({ where: { companyId, code: { in: productionAccounts.map((account) => account.code) } } });
      const finishedGoodsInventory = accounts.find((account) => account.code === '1700');
      const productionClearing = accounts.find((account) => account.code === '5100');

      const finishedGoodsValue = Number(product.unitPrice || 0) * Number(data.actualQty || 0);
      if (finishedGoodsInventory && productionClearing && finishedGoodsValue > 0) {
        const count = await tx.journalEntry.count({ where: { companyId } });
        await tx.journalEntry.create({
          data: {
            companyId,
            entryNumber: `JE-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`,
            reference: batch.batchNumber,
            description: `Production completion for ${batch.productName}`,
            lines: {
              create: [
                { accountId: finishedGoodsInventory.id, debit: finishedGoodsValue, credit: 0, memo: 'Finished goods received into inventory' },
                { accountId: productionClearing.id, debit: 0, credit: finishedGoodsValue, memo: 'Production cost cleared to finished goods' },
              ],
            },
          },
        });
      }

      if (batch.bom) {
        const factor = data.actualQty / batch.bom.outputQuantity;
        for (const item of batch.bom.items) {
          const required = item.quantity * factor;
          const material = await tx.rawMaterial.findFirst({ where: { id: item.rawMaterialId, companyId } });
          if (!material || material.currentStock < required) throw new BadRequestException(`Insufficient stock for BOM material ${material?.name || item.rawMaterialId}`);
          await tx.rawMaterial.update({ where: { id: material.id }, data: { currentStock: { decrement: required } } });
          await tx.stockMovement.create({ data: { type: 'ADJUSTMENT', reference: batch.batchNumber, itemType: 'RAW_MATERIAL', itemId: material.id, quantity: -required, notes: `BOM ${batch.bom.code} issued to production` } });
        }
      } else if (data.rawMaterialId && data.materialQty) {
        const material = await tx.rawMaterial.findFirst({ where: { id: data.rawMaterialId, companyId } });
        if (!material) throw new BadRequestException('Raw material not found');
        if (material.currentStock < data.materialQty) throw new BadRequestException(`Insufficient stock for ${material.name}`);
        await tx.rawMaterial.update({ where: { id: material.id }, data: { currentStock: { decrement: data.materialQty } } });
        await tx.stockMovement.create({
          data: { type: 'ADJUSTMENT', reference: batch.batchNumber, itemType: 'RAW_MATERIAL', itemId: material.id, quantity: -data.materialQty, notes: 'Issued to production' },
        });
      }

      await tx.finishedProduct.update({ where: { id: product.id }, data: { currentStock: { increment: Math.round(data.actualQty) } } });
      await tx.stockMovement.create({
        data: { type: 'PRODUCTION_OUTPUT', reference: batch.batchNumber, itemType: 'FINISHED_GOOD', itemId: product.id, quantity: data.actualQty, notes: 'Production output posted' },
      });
      return tx.productionBatch.update({ where: { id }, data: { status: 'COMPLETED', actualQty: data.actualQty } });
    });
  }

  async deleteBatch(id: string) {
    return this.prisma.productionBatch.delete({ where: { id } });
  }
}
