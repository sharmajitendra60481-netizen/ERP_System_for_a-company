import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: { companyId: string; userId?: string; module: string; action: string; resourceType: string; resourceId?: string; details?: unknown }): Promise<unknown> {
    return this.prisma.auditLog.create({
      data: { ...input, details: input.details ? JSON.stringify(input.details) : null },
    });
  }

  list(companyId: string) {
    return this.prisma.auditLog.findMany({ where: { companyId }, include: { user: { select: { firstName: true, lastName: true, email: true } } }, orderBy: { createdAt: 'desc' }, take: 200 });
  }
}
