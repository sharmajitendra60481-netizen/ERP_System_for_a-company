import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getFinishedProducts(companyId: string) {
    return this.prisma.finishedProduct.findMany({ where: { companyId }, orderBy: { name: 'asc' } });
  }

  async createFinishedProduct(companyId: string, data: { sku: string; name: string; packageSize: string; unitPrice: number; currentStock: number }) {
    return this.prisma.finishedProduct.create({ data: { ...data, companyId } });
  }

  async deleteFinishedProduct(companyId: string, id: string) {
    const result = await this.prisma.finishedProduct.deleteMany({ where: { id, companyId } });
    if (result.count === 0) {
      throw new NotFoundException('Finished product not found');
    }
    return { id };
  }

  async getStockMovements(companyId: string) {
    const [rawMaterials, products] = await Promise.all([
      this.prisma.rawMaterial.findMany({ where: { companyId }, select: { id: true } }),
      this.prisma.finishedProduct.findMany({ where: { companyId }, select: { id: true } }),
    ]);
    const itemIds = [...rawMaterials, ...products].map((item) => item.id);
    return this.prisma.stockMovement.findMany({ where: { itemId: { in: itemIds } }, take: 50, orderBy: { createdAt: 'desc' } });
  }
}
