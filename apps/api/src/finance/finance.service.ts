import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}
  accounts(companyId: string) { return this.prisma.chartOfAccount.findMany({ where: { companyId }, orderBy: { code: 'asc' } }); }
  entries(companyId: string) { return this.prisma.journalEntry.findMany({ where: { companyId }, include: { lines: { include: { account: true } } }, orderBy: { entryDate: 'desc' }, take: 200 }); }
  async createAccount(companyId: string, data: any) {
    if (!data.code || !data.name || !data.type) throw new BadRequestException('Account code, name, and type are required');
    return this.prisma.chartOfAccount.create({ data: { companyId, code: data.code, name: data.name, type: data.type } });
  }
  async createEntry(companyId: string, data: any) {
    if (!data.lines?.length) throw new BadRequestException('A journal entry needs lines');
    const debit = data.lines.reduce((sum: number, line: any) => sum + Number(line.debit || 0), 0);
    const credit = data.lines.reduce((sum: number, line: any) => sum + Number(line.credit || 0), 0);
    if (debit <= 0 || Math.abs(debit - credit) > 0.001) throw new BadRequestException('Journal debits and credits must balance');
    const accountIds = data.lines.map((line: any) => line.accountId);
    if (await this.prisma.chartOfAccount.count({ where: { companyId, id: { in: accountIds }, isActive: true } }) !== accountIds.length) throw new BadRequestException('A journal line uses an invalid account');
    const count = await this.prisma.journalEntry.count({ where: { companyId } });
    return this.prisma.journalEntry.create({ data: { companyId, entryNumber: `JE-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`, reference: data.reference || null, description: data.description || null, lines: { create: data.lines.map((line: any) => ({ accountId: line.accountId, debit: Number(line.debit || 0), credit: Number(line.credit || 0), memo: line.memo || null })) } }, include: { lines: { include: { account: true } } } });
  }

  async postCustomerPayment(companyId: string, payment: { id: string; amount: number; reference?: string | null }) {
    const required = [
      { code: '1100', name: 'Bank', type: 'ASSET' },
      { code: '1200', name: 'Accounts Receivable', type: 'ASSET' },
    ];
    for (const account of required) {
      await this.prisma.chartOfAccount.upsert({ where: { companyId_code: { companyId, code: account.code } }, update: {}, create: { companyId, ...account } });
    }
    const accounts = await this.prisma.chartOfAccount.findMany({ where: { companyId, code: { in: required.map((account) => account.code) } } });
    const bank = accounts.find((account) => account.code === '1100')!;
    const receivable = accounts.find((account) => account.code === '1200')!;
    return this.createEntry(companyId, { reference: payment.reference || payment.id, description: 'Customer payment received', lines: [
      { accountId: bank.id, debit: payment.amount, credit: 0, memo: 'Cash received' },
      { accountId: receivable.id, debit: 0, credit: payment.amount, memo: 'Customer receivable settled' },
    ] });
  }
}
