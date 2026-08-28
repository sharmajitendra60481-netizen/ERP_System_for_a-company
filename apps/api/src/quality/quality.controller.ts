import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QualityService } from './quality.service';

@Controller('quality')
@UseGuards(JwtAuthGuard)
export class QualityController {
  constructor(private readonly quality: QualityService) {}
  @Get('inspections') list(@Req() req: any) { return this.quality.list(req.user.companyId); }
  @Post('inspections') create(@Req() req: any, @Body() body: any) { return this.quality.create(req.user.companyId, body); }
}
