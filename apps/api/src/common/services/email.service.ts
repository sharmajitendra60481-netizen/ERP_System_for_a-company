import { Injectable, Logger } from '@nestjs/common'
import nodemailer from 'nodemailer'
import { Queue } from 'bullmq'

export interface EmailJob {
  to: string | string[]
  subject: string
  template: 'invoice' | 'purchase_order' | 'shipment' | 'payment' | 'alert' | 'approval'
  data: Record<string, any>
  attachments?: Array<{ filename: string; path: string }>
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name)
  private transporter: nodemailer.Transporter | null = null
  private emailQueue: Queue

  constructor(emailQueue: Queue) {
    this.emailQueue = emailQueue
    this.initializeTransport()
  }

  private initializeTransport() {
    // Configure based on environment variables
    const host = process.env.SMTP_HOST || 'smtp.gmail.com'
    const port = parseInt(process.env.SMTP_PORT || '465')
    const secure = port === 465

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
      },
    })

    this.logger.log(`Email transporter initialized with ${host}:${port}`)
  }

  /**
   * Queue an email for sending
   */
  async queueEmail(emailJob: EmailJob): Promise<string> {
    try {
      const job = await this.emailQueue.add(`send-email`, emailJob, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      })

      this.logger.log(`Email queued to ${emailJob.to}: ${emailJob.subject}`)
      return job.id || ''
    } catch (error) {
      this.logger.error(`Failed to queue email:`, error)
      throw error
    }
  }

  /**
   * Send email immediately (called by worker)
   */
  async sendEmail(emailJob: EmailJob): Promise<{ messageId: string; status: string }> {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized')
    }

    try {
      const html = this.generateEmailHTML(emailJob.template, emailJob.data)

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@oilerp.com',
        to: Array.isArray(emailJob.to) ? emailJob.to.join(',') : emailJob.to,
        subject: emailJob.subject,
        html,
        attachments: emailJob.attachments,
      }

      const info = await this.transporter.sendMail(mailOptions)

      this.logger.log(`Email sent: ${info.messageId}`)

      return {
        messageId: info.messageId,
        status: 'sent',
      }
    } catch (error) {
      this.logger.error(`Failed to send email:`, error)
      throw error
    }
  }

  /**
   * Generate HTML email from template
   */
  private generateEmailHTML(template: string, data: Record<string, any>): string {
    switch (template) {
      case 'invoice':
        return this.invoiceTemplate(data)
      case 'purchase_order':
        return this.purchaseOrderTemplate(data)
      case 'shipment':
        return this.shipmentTemplate(data)
      case 'payment':
        return this.paymentTemplate(data)
      case 'approval':
        return this.approvalTemplate(data)
      case 'alert':
        return this.alertTemplate(data)
      default:
        return '<p>Email notification from OilERP</p>'
    }
  }

  private invoiceTemplate(data: any): string {
    return `
      <h2>Invoice: ${data.invoiceNumber}</h2>
      <p>Dear ${data.customerName},</p>
      <p>Your invoice for ₹${data.total} is attached.</p>
      <p>
        <strong>Invoice Details:</strong><br>
        Invoice Number: ${data.invoiceNumber}<br>
        Date: ${data.invoiceDate}<br>
        Due Date: ${data.dueDate}<br>
        Total Amount: ₹${data.total}
      </p>
      <p>Please process payment at your earliest convenience.</p>
      <p>Thank you for your business!</p>
      <hr>
      <p><small>This is an automated message. Please do not reply to this email.</small></p>
    `
  }

  private purchaseOrderTemplate(data: any): string {
    return `
      <h2>Purchase Order: ${data.poNumber}</h2>
      <p>Dear ${data.supplierName},</p>
      <p>Please find attached the Purchase Order for your review and confirmation.</p>
      <p>
        <strong>Order Details:</strong><br>
        PO Number: ${data.poNumber}<br>
        Date: ${data.poDate}<br>
        Delivery Date: ${data.deliveryDate}<br>
        Total Amount: ₹${data.total}
      </p>
      <p>Please acknowledge receipt and confirm the delivery date.</p>
      <p>Thank you!</p>
      <hr>
      <p><small>This is an automated message. Please do not reply to this email.</small></p>
    `
  }

  private shipmentTemplate(data: any): string {
    return `
      <h2>Shipment Notification</h2>
      <p>Dear ${data.customerName},</p>
      <p>Your order has been shipped!</p>
      <p>
        <strong>Shipment Details:</strong><br>
        Order Number: ${data.orderNumber}<br>
        Shipment Date: ${data.shipmentDate}<br>
        Tracking Number: ${data.trackingNumber}<br>
        Expected Delivery: ${data.expectedDelivery}
      </p>
      <p>You can track your shipment using the tracking number above.</p>
      <p>Thank you for your order!</p>
      <hr>
      <p><small>This is an automated message. Please do not reply to this email.</small></p>
    `
  }

  private paymentTemplate(data: any): string {
    return `
      <h2>Payment Confirmation</h2>
      <p>Dear ${data.recipientName},</p>
      <p>Payment has been received and recorded in the system.</p>
      <p>
        <strong>Payment Details:</strong><br>
        Amount: ₹${data.amount}<br>
        Date: ${data.paymentDate}<br>
        Reference: ${data.referenceNumber}<br>
        Invoice: ${data.invoiceNumber}
      </p>
      <p>Your account is now up to date.</p>
      <hr>
      <p><small>This is an automated message. Please do not reply to this email.</small></p>
    `
  }

  private approvalTemplate(data: any): string {
    return `
      <h2>Action Required: Approval Needed</h2>
      <p>Dear ${data.approverName},</p>
      <p>A ${data.documentType} requires your approval.</p>
      <p>
        <strong>Document Details:</strong><br>
        Type: ${data.documentType}<br>
        Document Number: ${data.documentNumber}<br>
        Amount: ₹${data.amount}<br>
        Submitted By: ${data.submittedBy}
      </p>
      <p><a href="${data.approvalLink}" style="background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Review & Approve</a></p>
      <hr>
      <p><small>This is an automated message. Please do not reply to this email.</small></p>
    `
  }

  private alertTemplate(data: any): string {
    return `
      <h2>⚠️ Alert: ${data.alertType}</h2>
      <p>${data.message}</p>
      <p>
        <strong>Details:</strong><br>
        ${Object.entries(data.details || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join('<br>')}
      </p>
      <p>Please take necessary action.</p>
      <hr>
      <p><small>This is an automated system alert. Please do not reply to this email.</small></p>
    `
  }

  /**
   * Send invoice notification
   */
  async notifyInvoiceCreated(invoiceData: {
    invoiceNumber: string
    customerEmail: string
    customerName: string
    invoiceDate: string
    dueDate: string
    total: number
    attachmentPath?: string
  }) {
    await this.queueEmail({
      to: invoiceData.customerEmail,
      subject: `Invoice ${invoiceData.invoiceNumber} from OilERP`,
      template: 'invoice',
      data: invoiceData,
      attachments: invoiceData.attachmentPath
        ? [{ filename: `INV-${invoiceData.invoiceNumber}.pdf`, path: invoiceData.attachmentPath }]
        : [],
    })
  }

  /**
   * Send purchase order notification
   */
  async notifyPurchaseOrder(poData: {
    poNumber: string
    supplierEmail: string
    supplierName: string
    poDate: string
    deliveryDate: string
    total: number
    attachmentPath?: string
  }) {
    await this.queueEmail({
      to: poData.supplierEmail,
      subject: `Purchase Order ${poData.poNumber}`,
      template: 'purchase_order',
      data: poData,
      attachments: poData.attachmentPath
        ? [{ filename: `PO-${poData.poNumber}.pdf`, path: poData.attachmentPath }]
        : [],
    })
  }

  /**
   * Send approval notification
   */
  async notifyApprovalRequired(approvalData: {
    approverEmail: string
    approverName: string
    documentType: string
    documentNumber: string
    amount: number
    submittedBy: string
    approvalLink: string
  }) {
    await this.queueEmail({
      to: approvalData.approverEmail,
      subject: `Action Required: ${approvalData.documentType} Approval`,
      template: 'approval',
      data: approvalData,
    })
  }

  /**
   * Send system alert
   */
  async sendAlert(alertData: {
    recipientEmail: string | string[]
    alertType: string
    message: string
    details: Record<string, any>
  }) {
    await this.queueEmail({
      to: alertData.recipientEmail,
      subject: `Alert: ${alertData.alertType}`,
      template: 'alert',
      data: alertData,
    })
  }
}
