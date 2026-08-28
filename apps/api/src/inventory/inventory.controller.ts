import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('products')
  async getFinishedProducts(@Req() req: any) {
    return this.inventoryService.getFinishedProducts(req.user.companyId);
  }

  @Post('products')
  async createFinishedProduct(@Req() req: any, @Body() body: any) {
    return this.inventoryService.createFinishedProduct(req.user.companyId, body);
  }

  @Delete('products/:id')
  async deleteFinishedProduct(@Req() req: any, @Param('id') id: string) {
    return this.inventoryService.deleteFinishedProduct(req.user.companyId, id);
  }

  @Get('movements')
  async getStockMovements(@Req() req: any) {
    return this.inventoryService.getStockMovements(req.user.companyId);
  }
}
