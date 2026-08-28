import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FinanceService } from './finance.service';
@Controller('finance') @UseGuards(JwtAuthGuard)
export class FinanceController { constructor(private readonly finance: FinanceService) {}
  @Get('accounts') accounts(@Req() req: any) { return this.finance.accounts(req.user.companyId); }
  @Post('accounts') createAccount(@Req() req: any, @Body() body: any) { return this.finance.createAccount(req.user.companyId, body); }
  @Get('journal-entries') entries(@Req() req: any) { return this.finance.entries(req.user.companyId); }
  @Post('journal-entries') createEntry(@Req() req: any, @Body() body: any) { return this.finance.createEntry(req.user.companyId, body); }
}
