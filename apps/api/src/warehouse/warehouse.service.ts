import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) {}
  list(companyId: string) { return this.prisma.warehouse.findMany({ where: { companyId }, include: { locations: true }, orderBy: { code: 'asc' } }); }
  create(companyId: string, data: any): Promise<unknown> {
    if (!data.code || !data.name) throw new BadRequestException('Warehouse code and name are required');
    return this.prisma.warehouse.create({ data: { companyId, code: data.code, name: data.name, address: data.address || null } });
  }
  async addLocation(companyId: string, warehouseId: string, data: any) {
    if (!data.code) throw new BadRequestException('Location code is required');
    const warehouse = await this.prisma.warehouse.findFirst({ where: { id: warehouseId, companyId } });
    if (!warehouse) throw new BadRequestException('Warehouse not found');
    return this.prisma.warehouseLocation.create({ data: { code: data.code, zone: data.zone || null, warehouseId } });
  }
  lots(companyId: string) { return this.prisma.inventoryLot.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } }); }
}
