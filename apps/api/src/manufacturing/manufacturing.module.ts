import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ManufacturingController } from './manufacturing.controller';
import { ManufacturingService } from './manufacturing.service';
@Module({ controllers: [ManufacturingController], providers: [ManufacturingService, PrismaService] }) export class ManufacturingModule {}
