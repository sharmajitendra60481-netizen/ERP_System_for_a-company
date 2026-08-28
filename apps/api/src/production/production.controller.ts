import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ProductionService } from './production.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditService } from '../audit/audit.service';

@Controller('production')
@UseGuards(JwtAuthGuard)
export class ProductionController {
  constructor(private readonly productionService: ProductionService, private readonly audit: AuditService) {}

  @Get('tanks')
  async getTanks(@Req() req: any) {
    return this.productionService.getTanks(req.user.companyId);
  }

  @Post('tanks')
  async createTank(@Req() req: any, @Body() body: any) {
    return this.productionService.createTank(req.user.companyId, body);
  }

  @Patch('tanks/:id')
  async updateTank(@Param('id') id: string, @Body() body: any) {
    return this.productionService.updateTank(id, body);
  }

  @Delete('tanks/:id')
  async deleteTank(@Param('id') id: string) {
    return this.productionService.deleteTank(id);
  }

  @Get('batches')
  async getBatches(@Req() req: any) {
    return this.productionService.getBatches(req.user.companyId);
  }

  @Post('batches')
  async createBatch(@Req() req: any, @Body() body: any) {
    return this.productionService.createBatch(req.user.companyId, body);
  }

  @Patch('batches/:id')
  async updateBatchStatus(@Param('id') id: string, @Body() body: { status: any; actualQty?: number }) {
    return this.productionService.updateBatchStatus(id, body.status, body.actualQty);
  }

  @Post('batches/:id/complete')
  async completeBatch(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    const batch = await this.productionService.completeBatch(req.user.companyId, id, body);
    await this.audit.record({ companyId: req.user.companyId, userId: req.user.sub, module: 'PRODUCTION', action: 'COMPLETE', resourceType: 'PRODUCTION_BATCH', resourceId: id, details: { batchNumber: batch.batchNumber, actualQty: batch.actualQty } });
    return batch;
  }

  @Delete('batches/:id')
  async deleteBatch(@Param('id') id: string) {
    return this.productionService.deleteBatch(id);
  }
}
