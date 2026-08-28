import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditService } from '../audit/audit.service';
import { FinanceService } from '../finance/finance.service';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService, private readonly audit: AuditService, private readonly finance: FinanceService) {}

  @Get('customers')
  async getCustomers(@Req() req: any) {
    return this.salesService.getCustomers(req.user.companyId);
  }

  @Post('customers')
  async createCustomer(@Req() req: any, @Body() body: any) {
    return this.salesService.createCustomer(req.user.companyId, body);
  }

  @Delete('customers/:id')
  async deleteCustomer(@Param('id') id: string) {
    return this.salesService.deleteCustomer(id);
  }

  @Get('orders')
  async getSalesOrders(@Req() req: any) {
    return this.salesService.getSalesOrders(req.user.companyId);
  }

  @Post('orders')
  async createSalesOrder(@Req() req: any, @Body() body: any) {
    return this.salesService.createSalesOrder(req.user.companyId, body);
  }

  @Post('orders/:id/dispatch')
  async dispatchSalesOrder(@Req() req: any, @Param('id') id: string) {
    const order = await this.salesService.dispatchSalesOrder(req.user.companyId, id);
    await this.audit.record({ companyId: req.user.companyId, userId: req.user.sub, module: 'SALES', action: 'DISPATCH', resourceType: 'SALES_ORDER', resourceId: id, details: { soNumber: order.soNumber } });
    return order;
  }

  @Delete('orders/:id')
  async deleteSalesOrder(@Param('id') id: string) {
    return this.salesService.deleteSalesOrder(id);
  }

  @Get('invoices')
  async getInvoices(@Req() req: any) {
    return this.salesService.getInvoices(req.user.companyId);
  }

  @Post('invoices')
  async createInvoice(@Req() req: any, @Body() body: any) {
    return this.salesService.createInvoice(req.user.companyId, body);
  }

  @Post('invoices/:id/payments')
  async recordPayment(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    const payment = await this.salesService.recordPayment(req.user.companyId, id, body);
    await this.finance.postCustomerPayment(req.user.companyId, payment);
    await this.audit.record({ companyId: req.user.companyId, userId: req.user.sub, module: 'FINANCE', action: 'RECEIVE_PAYMENT', resourceType: 'INVOICE', resourceId: id, details: { amount: payment.amount, reference: payment.reference } });
    return payment;
  }

  @Delete('invoices/:id')
  async deleteInvoice(@Param('id') id: string) {
    return this.salesService.deleteInvoice(id);
  }
}
