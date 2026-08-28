import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ManufacturingService } from './manufacturing.service';
@Controller('manufacturing') @UseGuards(JwtAuthGuard)
export class ManufacturingController {
  constructor(private readonly manufacturing: ManufacturingService) {}
  @Get('boms') list(@Req() req: any) { return this.manufacturing.listBoms(req.user.companyId); }
  @Post('boms') create(@Req() req: any, @Body() body: any) { return this.manufacturing.createBom(req.user.companyId, body); }
  @Get('boms/:id/requirements') requirements(@Req() req: any, @Param('id') id: string, @Query('quantity') quantity: string) { return this.manufacturing.materialRequirements(req.user.companyId, id, Number(quantity)); }
}
