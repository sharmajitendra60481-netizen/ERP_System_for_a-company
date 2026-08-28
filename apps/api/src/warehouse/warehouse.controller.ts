import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
@UseGuards(JwtAuthGuard)
export class WarehouseController {
  constructor(private readonly warehouse: WarehouseService) {}
  @Get() list(@Req() req: any) { return this.warehouse.list(req.user.companyId); }
  @Post() create(@Req() req: any, @Body() body: any): Promise<unknown> { return this.warehouse.create(req.user.companyId, body); }
  @Post(':id/locations') addLocation(@Req() req: any, @Param('id') id: string, @Body() body: any) { return this.warehouse.addLocation(req.user.companyId, id, body); }
  @Get('lots') lots(@Req() req: any) { return this.warehouse.lots(req.user.companyId); }
}
