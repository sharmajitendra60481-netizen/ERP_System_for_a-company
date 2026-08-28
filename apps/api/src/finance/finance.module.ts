import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
@Global()
@Module({ controllers: [FinanceController], providers: [FinanceService, PrismaService], exports: [FinanceService] }) export class FinanceModule {}
