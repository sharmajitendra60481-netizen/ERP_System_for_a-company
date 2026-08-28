import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ManufacturingService {
  constructor(private readonly prisma: PrismaService) {}
  listBoms(companyId: string) { return this.prisma.billOfMaterials.findMany({ where: { companyId }, include: { items: true }, orderBy: { createdAt: 'desc' } }); }
  async createBom(companyId: string, data: any) {
    if (!data.code || !data.name || !data.finishedProductId || !data.items?.length) throw new BadRequestException('Code, name, finished product, and at least one material are required');
    const product = await this.prisma.finishedProduct.findFirst({ where: { id: data.finishedProductId, companyId } });
    if (!product) throw new BadRequestException('Finished product not found');
    const materialIds = data.items.map((item: any) => item.rawMaterialId);
    const materialCount = await this.prisma.rawMaterial.count({ where: { companyId, id: { in: materialIds } } });
    if (materialCount !== materialIds.length) throw new BadRequestException('One or more raw materials are invalid');
    return this.prisma.billOfMaterials.create({ data: { companyId, code: data.code, name: data.name, finishedProductId: data.finishedProductId, outputQuantity: Number(data.outputQuantity || 1), items: { create: data.items.map((item: any) => ({ rawMaterialId: item.rawMaterialId, quantity: Number(item.quantity), unit: item.unit || 'KG' })) } }, include: { items: true } });
  }
  async materialRequirements(companyId: string, bomId: string, targetQuantity: number) {
    const bom = await this.prisma.billOfMaterials.findFirst({ where: { id: bomId, companyId }, include: { items: true } });
    if (!bom || targetQuantity <= 0) throw new BadRequestException('A BOM and positive target quantity are required');
    const factor = targetQuantity / bom.outputQuantity;
    const stocks = await this.prisma.rawMaterial.findMany({ where: { companyId, id: { in: bom.items.map((item) => item.rawMaterialId) } } });
    return bom.items.map((item) => { const material = stocks.find((stock) => stock.id === item.rawMaterialId); const required = item.quantity * factor; return { rawMaterialId: item.rawMaterialId, required, available: material?.currentStock || 0, shortage: Math.max(0, required - (material?.currentStock || 0)), unit: item.unit }; });
  }
}
