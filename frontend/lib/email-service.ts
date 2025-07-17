// EmailJS Service for FREE email notifications
import emailjs from '@emailjs/browser';

interface EmailData {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  order_number?: string;
  delivery_status?: string;
  delivery_time?: string;
  [key: string]: unknown; // Index signature for EmailJS compatibility
}

class EmailService {
  private serviceId: string;
  private templateId: string;
  private publicKey: string;

  constructor() {
    this.serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    this.templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    this.publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    // Initialize EmailJS
    if (this.publicKey) {
      emailjs.init(this.publicKey);
    }
  }

  // Send order confirmation email
  async sendOrderConfirmation(orderData: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    totalAmount: number;
    items: Array<{ name: string; quantity: number; price: number }>;
  }) {
    const emailData: EmailData = {
      to_email: orderData.customerEmail,
      to_name: orderData.customerName,
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      message: `
        Dear ${orderData.customerName},
        
        Your order has been confirmed!
        
        Order Number: ${orderData.orderNumber}
        Total Amount: ₹${orderData.totalAmount}
        
        Items:
        ${orderData.items.map(item => `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`).join('\n')}
        
        We'll keep you updated on your delivery status.
        
        Thank you for choosing Avaxen Pharma!
      `,
      order_number: orderData.orderNumber
    };

    return this.sendEmail(emailData);
  }

  // Send delivery status update
  async sendDeliveryUpdate(updateData: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    status: string;
    estimatedTime?: string;
    deliveryAgent?: string;
  }) {
    const emailData: EmailData = {
      to_email: updateData.customerEmail,
      to_name: updateData.customerName,
      subject: `Delivery Update - ${updateData.orderNumber}`,
      message: `
        Dear ${updateData.customerName},
        
        Your order status has been updated:
        
        Order Number: ${updateData.orderNumber}
        Status: ${updateData.status}
        ${updateData.estimatedTime ? `Estimated Delivery: ${updateData.estimatedTime}` : ''}
        ${updateData.deliveryAgent ? `Delivery Agent: ${updateData.deliveryAgent}` : ''}
        
        Track your order: ${process.env.NEXT_PUBLIC_APP_URL}/track-order?order=${updateData.orderNumber}
        
        Thank you for your patience!
      `,
      order_number: updateData.orderNumber,
      delivery_status: updateData.status,
      delivery_time: updateData.estimatedTime
    };

    return this.sendEmail(emailData);
  }

  // Send prescription approval notification
  async sendPrescriptionApproval(prescriptionData: {
    customerEmail: string;
    customerName: string;
    prescriptionId: string;
    status: 'approved' | 'rejected';
    pharmacistName: string;
    comments?: string;
  }) {
    const emailData: EmailData = {
      to_email: prescriptionData.customerEmail,
      to_name: prescriptionData.customerName,
      subject: `Prescription ${prescriptionData.status === 'approved' ? 'Approved' : 'Requires Review'}`,
      message: `
        Dear ${prescriptionData.customerName},
        
        Your prescription has been reviewed by our pharmacist.
        
        Prescription ID: ${prescriptionData.prescriptionId}
        Status: ${prescriptionData.status.toUpperCase()}
        Reviewed by: ${prescriptionData.pharmacistName}
        
        ${prescriptionData.comments ? `Comments: ${prescriptionData.comments}` : ''}
        
        ${prescriptionData.status === 'approved' 
          ? 'You can now proceed to place your order with the approved medicines.'
          : 'Please contact our pharmacy for more information or upload a clearer prescription.'
        }
        
        Best regards,
        Avaxen Pharma Team
      `
    };

    return this.sendEmail(emailData);
  }

  // Generic email sender
  private async sendEmail(emailData: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.serviceId || !this.templateId || !this.publicKey) {
        console.warn('EmailJS not configured. Email data:', emailData);
        return {
          success: false,
          message: 'Email service not configured'
        };
      }

      const result = await emailjs.send(
        this.serviceId,
        this.templateId,
        emailData
      );

      console.log('Email sent successfully:', result);
      return {
        success: true,
        message: 'Email sent successfully'
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        message: `Email sending failed: ${error}`
      };
    }
  }

  // Test email configuration
  async testEmailConfig(): Promise<{ success: boolean; message: string }> {
    return this.sendEmail({
      to_email: 'test@avaxen.com',
      to_name: 'Test User',
      subject: 'EmailJS Configuration Test',
      message: 'This is a test email to verify EmailJS configuration.'
    });
  }
}

export const emailService = new EmailService();
