import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomers(companyId: string) {
    return this.prisma.customer.findMany({ where: { companyId }, orderBy: { name: 'asc' } });
  }

  async createCustomer(companyId: string, data: any) {
    return this.prisma.customer.create({ data: { ...data, companyId } });
  }

  async deleteCustomer(id: string) {
    return this.prisma.customer.delete({ where: { id } });
  }

  async deleteSalesOrder(id: string) {
    return this.prisma.salesOrder.delete({ where: { id } });
  }

  async getSalesOrders(companyId: string) {
    return this.prisma.salesOrder.findMany({ where: { companyId }, include: { customer: true, items: { include: { finishedProduct: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async createSalesOrder(companyId: string, data: { customerId: string; items: { finishedProductId: string; quantity: number; unitPrice: number }[] }) {
    if (!data.items?.length) throw new BadRequestException('A sales order needs at least one item');
    const totalAmount = data.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const count = await this.prisma.salesOrder.count();
    const soNumber = `SO-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
    return this.prisma.salesOrder.create({ data: { soNumber, companyId, customerId: data.customerId, totalAmount, items: { create: data.items.map((i) => ({ finishedProductId: i.finishedProductId, quantity: i.quantity, unitPrice: i.unitPrice, totalPrice: i.quantity * i.unitPrice })) } }, include: { customer: true, items: true } });
  }

  async deleteInvoice(id: string) {
    return this.prisma.invoice.delete({ where: { id } });
  }

  async getInvoices(companyId: string) {
    return this.prisma.invoice.findMany({ where: { companyId }, include: { customer: true, payments: true }, orderBy: { createdAt: 'desc' } });
  }

  async createInvoice(companyId: string, data: { customerId: string; salesOrderId?: string; subtotal: number; taxAmount: number }) {
    const count = await this.prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
    return this.prisma.invoice.create({ data: { invoiceNumber, companyId, customerId: data.customerId, salesOrderId: data.salesOrderId || null, subtotal: data.subtotal, taxAmount: data.taxAmount, grandTotal: data.subtotal + data.taxAmount }, include: { customer: true } });
  }

  async dispatchSalesOrder(companyId: string, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.salesOrder.findFirst({
        where: { id, companyId }, include: { items: { include: { finishedProduct: true } } },
      });
      if (!order) throw new BadRequestException('Sales order not found');
      if (order.status !== 'DRAFT' && order.status !== 'CONFIRMED') {
        throw new BadRequestException('Only draft or confirmed orders can be dispatched');
      }
      for (const item of order.items) {
        if (item.finishedProduct.currentStock < item.quantity) {
          throw new BadRequestException(`Insufficient finished stock for ${item.finishedProduct.name}`);
        }
        await tx.finishedProduct.update({ where: { id: item.finishedProductId }, data: { currentStock: { decrement: item.quantity } } });
        await tx.stockMovement.create({
          data: { type: 'DISPATCH', reference: order.soNumber, itemType: 'FINISHED_GOOD', itemId: item.finishedProductId, quantity: -item.quantity, notes: 'Customer order dispatched' },
        });
      }
      return tx.salesOrder.update({ where: { id }, data: { status: 'DISPATCHED' } });
    });
  }

  async recordPayment(companyId: string, invoiceId: string, data: { amount: number; paymentMethod?: string; reference?: string }) {
    if (!data.amount || data.amount <= 0) throw new BadRequestException('Payment amount must be positive');
    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findFirst({ where: { id: invoiceId, companyId }, include: { payments: true } });
      if (!invoice) throw new BadRequestException('Invoice not found');
      if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') throw new BadRequestException('Payment cannot be recorded for this invoice');
      const paidBefore = invoice.payments.reduce((total, payment) => total + payment.amount, 0);
      if (paidBefore + data.amount > invoice.grandTotal) throw new BadRequestException('Payment exceeds invoice balance');
      const payment = await tx.payment.create({ data: { invoiceId, amount: data.amount, paymentMethod: data.paymentMethod || 'BANK_TRANSFER', reference: data.reference } });
      const totalPaid = paidBefore + data.amount;
      await tx.invoice.update({ where: { id: invoiceId }, data: { status: totalPaid === invoice.grandTotal ? 'PAID' : 'PARTIAL' } });
      return payment;
    });
  }
}
