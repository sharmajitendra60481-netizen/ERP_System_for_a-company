/**
 * Domain Events System
 * Every significant business action publishes an event
 * that triggers cascading operations across the system
 */

export enum DomainEventType {
  // Procurement
  PURCHASE_ORDER_CREATED = 'procurement.purchase_order.created',
  PURCHASE_ORDER_APPROVED = 'procurement.purchase_order.approved',
  PURCHASE_ORDER_CANCELLED = 'procurement.purchase_order.cancelled',
  GOODS_RECEIVED = 'procurement.goods.received',
  GOODS_REJECTED = 'procurement.goods.rejected',
  SUPPLIER_INVOICE_CREATED = 'procurement.supplier_invoice.created',
  PURCHASE_PAYMENT_RECEIVED = 'procurement.payment.received',

  // Inventory
  STOCK_RECEIVED = 'inventory.stock.received',
  STOCK_ISSUED = 'inventory.stock.issued',
  STOCK_TRANSFERRED = 'inventory.stock.transferred',
  BATCH_CREATED = 'inventory.batch.created',
  STOCK_ADJUSTMENT = 'inventory.stock.adjusted',

  // Manufacturing
  PRODUCTION_ORDER_CREATED = 'manufacturing.production_order.created',
  PRODUCTION_STARTED = 'manufacturing.production.started',
  MATERIAL_CONSUMED = 'manufacturing.material.consumed',
  PRODUCTION_COMPLETED = 'manufacturing.production.completed',
  PRODUCTION_YIELD_CALCULATED = 'manufacturing.production.yield_calculated',

  // Quality
  QC_INSPECTION_STARTED = 'quality.inspection.started',
  QC_INSPECTION_PASSED = 'quality.inspection.passed',
  QC_INSPECTION_FAILED = 'quality.inspection.failed',
  BATCH_QUARANTINED = 'quality.batch.quarantined',
  BATCH_RELEASED = 'quality.batch.released',

  // Sales
  SALES_ORDER_CREATED = 'sales.order.created',
  SALES_ORDER_APPROVED = 'sales.order.approved',
  STOCK_RESERVED = 'sales.stock.reserved',
  SHIPMENT_CREATED = 'sales.shipment.created',
  GOODS_SHIPPED = 'sales.goods.shipped',
  SALES_INVOICE_CREATED = 'sales.invoice.created',
  PAYMENT_RECEIVED = 'sales.payment.received',

  // Finance
  ACCOUNTING_ENTRY_REQUIRED = 'finance.accounting_entry.required',
  INVOICE_APPROVED = 'finance.invoice.approved',
  THREE_WAY_MATCH_EXCEPTION = 'finance.three_way_match.exception',

  // Notifications
  NOTIFICATION_REQUIRED = 'system.notification.required',
  DOCUMENT_GENERATED = 'system.document.generated',
}

export interface DomainEvent {
  type: DomainEventType
  aggregateId: string
  aggregateType: string
  data: Record<string, any>
  timestamp: Date
  userId: string
  companyId: string
  metadata?: Record<string, any>
}

export interface DomainEventHandler {
  handle(event: DomainEvent): Promise<void>
}

export interface EventBus {
  publish(event: DomainEvent): Promise<void>
  subscribe(eventType: DomainEventType, handler: DomainEventHandler): void
}
