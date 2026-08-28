import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class QualityService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId: string) {
    return this.prisma.qualityInspection.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
  }

  async create(companyId: string, data: any) {
    const ffa = Number(data.ffaPercentage);
    const peroxide = Number(data.peroxideValue);
    const moisture = Number(data.moisturePct);
    if ([ffa, peroxide, moisture].some(Number.isNaN)) throw new BadRequestException('All quality measurements are required');
    const count = await this.prisma.qualityInspection.count({ where: { companyId } });
    const status = ffa < 0.1 && peroxide < 2 && moisture < 0.05 ? 'PASSED' : 'REJECTED';

    return this.prisma.$transaction(async (tx) => {
      const inspection = await tx.qualityInspection.create({
        data: {
          inspectionNo: `QC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`,
          companyId,
          batchReference: data.batchReference,
          productName: data.productName,
          ffaPercentage: ffa,
          peroxideValue: peroxide,
          moisturePct: moisture,
          status,
          notes: data.notes || null,
        },
      });

      if (data.batchReference) {
        const batch = await tx.productionBatch.findFirst({
          where: { batchNumber: data.batchReference, companyId },
        });

        if (batch) {
          await tx.productionBatch.update({
            where: { id: batch.id },
            data: { status: status === 'PASSED' ? 'COMPLETED' : 'CANCELLED' },
          });
        }
      }

      return inspection;
    });
  }
}
