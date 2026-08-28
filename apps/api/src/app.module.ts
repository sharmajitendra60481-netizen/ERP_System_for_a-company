import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ProcurementModule } from './procurement/procurement.module';
import { ProductionModule } from './production/production.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { MailModule } from './mail/mail.module';
import { QualityModule } from './quality/quality.module';
import { AuditModule } from './audit/audit.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ManufacturingModule } from './manufacturing/manufacturing.module';
import { FinanceModule } from './finance/finance.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    AuthModule,
    ProcurementModule,
    ProductionModule,
    InventoryModule,
    SalesModule,
    MailModule,
    QualityModule,
    AuditModule,
    WarehouseModule,
    ManufacturingModule,
    FinanceModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
