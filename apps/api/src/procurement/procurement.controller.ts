import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditService } from '../audit/audit.service';

@Controller('procurement')
@UseGuards(JwtAuthGuard)
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService, private readonly audit: AuditService) {}

  @Get('suppliers')
  async getSuppliers(@Req() req: any) {
    return this.procurementService.getSuppliers(req.user.companyId);
  }

  @Post('suppliers')
  async createSupplier(@Req() req: any, @Body() body: any) {
    return this.procurementService.createSupplier(req.user.companyId, body);
  }

  @Delete('suppliers/:id')
  async deleteSupplier(@Param('id') id: string) {
    return this.procurementService.deleteSupplier(id);
  }

  @Get('raw-materials')
  async getRawMaterials(@Req() req: any) {
    return this.procurementService.getRawMaterials(req.user.companyId);
  }

  @Post('raw-materials')
  async createRawMaterial(@Req() req: any, @Body() body: any) {
    return this.procurementService.createRawMaterial(req.user.companyId, body);
  }

  @Delete('raw-materials/:id')
  async deleteRawMaterial(@Param('id') id: string) {
    return this.procurementService.deleteRawMaterial(id);
  }

  @Get('purchase-orders')
  async getPurchaseOrders(@Req() req: any) {
    return this.procurementService.getPurchaseOrders(req.user.companyId);
  }

  @Post('purchase-orders')
  async createPurchaseOrder(@Req() req: any, @Body() body: any) {
    return this.procurementService.createPurchaseOrder(req.user.companyId, body);
  }

  @Patch('purchase-orders/:id/approve')
  async approvePurchaseOrder(@Req() req: any, @Param('id') id: string) {
    const order = await this.procurementService.approvePurchaseOrder(req.user.companyId, id);
    await this.audit.record({ companyId: req.user.companyId, userId: req.user.sub, module: 'PROCUREMENT', action: 'APPROVE', resourceType: 'PURCHASE_ORDER', resourceId: id, details: { poNumber: order.poNumber } });
    return order;
  }

  @Post('purchase-orders/:id/receive')
  async receivePurchaseOrder(@Req() req: any, @Param('id') id: string) {
    const order = await this.procurementService.receivePurchaseOrder(req.user.companyId, id);
    await this.audit.record({ companyId: req.user.companyId, userId: req.user.sub, module: 'PROCUREMENT', action: 'RECEIVE', resourceType: 'PURCHASE_ORDER', resourceId: id, details: { poNumber: order.poNumber } });
    return order;
  }

  @Delete('purchase-orders/:id')
  async deletePurchaseOrder(@Param('id') id: string) {
    return this.procurementService.deletePurchaseOrder(id);
  }
}
