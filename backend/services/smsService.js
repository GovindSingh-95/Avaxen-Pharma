// AWS SNS Service for FREE SMS notifications (Better for Indian market)
const AWS = require('aws-sdk');

class SMSService {
  constructor() {
    this.sns = null;
    this.isConfigured = false;

    // Configure AWS SNS for ap-south-1 (Mumbai) region
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_SNS_REGION || 'ap-south-1'
      });

      this.sns = new AWS.SNS();
      this.isConfigured = true;
      console.log('✅ AWS SNS configured for region:', process.env.AWS_SNS_REGION || 'ap-south-1');
    } else {
      console.warn('⚠️ AWS SNS not configured - SMS notifications disabled');
    }
  }

  // Send order confirmation SMS
  async sendOrderConfirmationSMS(orderData) {
    const message = `Dear ${orderData.customerName}, your order ${orderData.orderNumber} of ₹${orderData.totalAmount} has been confirmed. Track: ${process.env.FRONTEND_URL || 'https://avaxen.com'}/track-order?order=${orderData.orderNumber} - Avaxen Pharma`;
    
    return this.sendSMS(orderData.phone, message);
  }

  // Send delivery status update SMS
  async sendDeliveryUpdateSMS(updateData) {
    let message = `Hi ${updateData.customerName}, your order ${updateData.orderNumber} is ${updateData.status.toLowerCase()}.`;
    
    if (updateData.estimatedTime) {
      message += ` ETA: ${updateData.estimatedTime}.`;
    }
    
    if (updateData.deliveryAgent) {
      message += ` Agent: ${updateData.deliveryAgent}.`;
    }
    
    message += ` Track: ${process.env.FRONTEND_URL || 'https://avaxen.com'}/track-order?order=${updateData.orderNumber} - Avaxen`;
    
    return this.sendSMS(updateData.phone, message);
  }

  // Send OTP for order verification
  async sendOTP(phone, otp, orderNumber) {
    const message = `Your OTP for order ${orderNumber} is: ${otp}. Valid for 10 minutes. Do not share with anyone. - Avaxen Pharma`;
    
    return this.sendSMS(phone, message);
  }

  // Send prescription approval SMS
  async sendPrescriptionApprovalSMS(prescriptionData) {
    const message = `Dear ${prescriptionData.customerName}, your prescription ${prescriptionData.prescriptionId} has been ${prescriptionData.status}. ${prescriptionData.status === 'approved' ? 'You can now place your order.' : 'Please contact us for more info.'} - Avaxen Pharma`;
    
    return this.sendSMS(prescriptionData.phone, message);
  }

  // Send medicine recognition SMS
  async sendMedicineRecognitionSMS(recognitionData) {
    const message = `Hi ${recognitionData.customerName}, we identified "${recognitionData.medicineName}" with ${recognitionData.confidence}% confidence from your scan. Check the app for details and alternatives. - Avaxen Pharma`;
    
    return this.sendSMS(recognitionData.phone, message);
  }

  // Generic SMS sender with Indian phone number formatting
  async sendSMS(phone, message) {
    try {
      if (!this.isConfigured) {
        console.warn('SMS service not configured. Message:', message);
        return {
          success: false,
          message: 'SMS service not configured'
        };
      }

      // Format Indian phone number
      const formattedPhone = this.formatIndianPhoneNumber(phone);
      
      if (!formattedPhone) {
        return {
          success: false,
          message: 'Invalid phone number format'
        };
      }

      const params = {
        Message: message,
        PhoneNumber: formattedPhone,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: 'AVAXEN' // Sender ID for India
          },
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional' // Transactional SMS for better delivery
          }
        }
      };

      const result = await this.sns.publish(params).promise();
      
      console.log('📱 SMS sent successfully:', {
        phone: formattedPhone,
        messageId: result.MessageId,
        message: message.substring(0, 50) + '...'
      });

      return {
        success: true,
        message: 'SMS sent successfully',
        messageId: result.MessageId
      };
    } catch (error) {
      console.error('❌ SMS sending failed:', error);
      return {
        success: false,
        message: `SMS sending failed: ${error}`
      };
    }
  }

  // Format Indian phone numbers to international format
  formatIndianPhoneNumber(phone) {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Indian phone number patterns
    if (digits.length === 10 && (digits.startsWith('6') || digits.startsWith('7') || digits.startsWith('8') || digits.startsWith('9'))) {
      return `+91${digits}`;
    } else if (digits.length === 13 && digits.startsWith('91')) {
      return `+${digits}`;
    } else if (digits.length === 12 && digits.startsWith('91')) {
      return `+${digits}`;
    }
    
    console.warn('Invalid Indian phone number format:', phone);
    return null;
  }

  // Test SMS configuration
  async testSMSConfig(testPhone) {
    return this.sendSMS(testPhone, 'This is a test message from Avaxen Pharma. SMS service is working correctly!');
  }

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Get SMS delivery status
  async getSMSStatus(messageId) {
    try {
      if (!this.isConfigured) {
        return {
          success: false,
          message: 'SMS service not configured'
        };
      }

      // AWS SNS doesn't provide delivery status for SMS by default
      // You would need to set up SNS delivery status logging
      return {
        success: true,
        status: 'sent',
        message: 'SMS status check requires SNS delivery logging setup'
      };
    } catch (error) {
      return {
        success: false,
        message: `Status check failed: ${error}`
      };
    }
  }
}

module.exports = new SMSService();
