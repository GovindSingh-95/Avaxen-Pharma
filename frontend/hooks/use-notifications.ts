"use client";

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

// EmailJS configuration (using your existing setup)
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_avaxen_pharma';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_pharmacy_order';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_emailjs_public_key';

interface NotificationData {
  type: 'order_placed' | 'order_confirmed' | 'driver_assigned' | 'out_for_delivery' | 'delivered' | 'prescription_uploaded';
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderDetails?: any;
  deliveryAgent?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  estimatedTime?: string;
}

interface NotificationHook {
  sendNotification: (data: NotificationData) => Promise<boolean>;
  sendEmail: (data: NotificationData) => Promise<boolean>;
  showToast: (type: string, message: string, description?: string) => void;
  isLoading: boolean;
}

export function useNotifications(): NotificationHook {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const getEmailTemplate = (type: string, data: NotificationData) => {
    const templates = {
      order_placed: {
        subject: `Order Confirmation - #${data.orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0; font-size: 28px;">🏥 Avaxen Pharmacy</h1>
                <p style="color: #6b7280; margin: 10px 0 0 0;">Your Trusted Healthcare Partner</p>
              </div>
              
              <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h2 style="color: #166534; margin: 0 0 15px 0; font-size: 20px;">✅ Order Confirmed!</h2>
                <p style="color: #166534; margin: 0; font-size: 16px;">
                  Dear ${data.customerName}, your order has been successfully placed and confirmed.
                </p>
              </div>
              
              <div style="margin-bottom: 25px;">
                <h3 style="color: #374151; margin: 0 0 15px 0;">📦 Order Details:</h3>
                <div style="background: #f9fafb; border-radius: 8px; padding: 15px;">
                  <p style="margin: 5px 0;"><strong>Order ID:</strong> #${data.orderId}</p>
                  <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #10b981;">Confirmed</span></p>
                  <p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${data.estimatedTime || '30-45 minutes'}</p>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/track-order" style="background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                  📍 Track Your Order
                </a>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                <p>Need help? Contact us at <a href="tel:+911234567890" style="color: #10b981;">+91 12345 67890</a></p>
                <p>© 2025 Avaxen Pharmacy. All rights reserved.</p>
              </div>
            </div>
          </div>
        `
      },
      driver_assigned: {
        subject: `Driver Assigned - Order #${data.orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0; font-size: 28px;">🏥 Avaxen Pharmacy</h1>
              </div>
              
              <div style="background: #eff6ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h2 style="color: #1d4ed8; margin: 0 0 15px 0; font-size: 20px;">🚚 Driver Assigned!</h2>
                <p style="color: #1d4ed8; margin: 0; font-size: 16px;">
                  Great news! Your delivery driver has been assigned and is preparing to collect your order.
                </p>
              </div>
              
              <div style="margin-bottom: 25px;">
                <h3 style="color: #374151; margin: 0 0 15px 0;">👨‍💼 Your Delivery Agent:</h3>
                <div style="background: #f9fafb; border-radius: 8px; padding: 15px;">
                  <p style="margin: 5px 0;"><strong>Name:</strong> ${data.deliveryAgent?.name || 'Professional Agent'}</p>
                  <p style="margin: 5px 0;"><strong>Vehicle:</strong> ${data.deliveryAgent?.vehicle || 'Delivery Vehicle'}</p>
                  <p style="margin: 5px 0;"><strong>Contact:</strong> ${data.deliveryAgent?.phone || '+91 9999999999'}</p>
                  <p style="margin: 5px 0;"><strong>ETA:</strong> ${data.estimatedTime || '20-30 minutes'}</p>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/track-order" style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                  📍 Track Live Location
                </a>
              </div>
            </div>
          </div>
        `
      },
      delivered: {
        subject: `Order Delivered Successfully - #${data.orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0; font-size: 28px;">🏥 Avaxen Pharmacy</h1>
              </div>
              
              <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 25px; text-align: center;">
                <h2 style="color: #166534; margin: 0 0 15px 0; font-size: 24px;">🎉 Order Delivered!</h2>
                <p style="color: #166534; margin: 0; font-size: 16px;">
                  Your medicines have been successfully delivered. Thank you for choosing Avaxen Pharmacy!
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/medicines" style="background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 10px;">
                  🛒 Order Again
                </a>
                <a href="http://localhost:3000/profile" style="background: #6b7280; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                  📋 Order History
                </a>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                <p>Rate your experience and help us serve you better!</p>
              </div>
            </div>
          </div>
        `
      }
    };

    return templates[type as keyof typeof templates] || templates.order_placed;
  };

  const sendEmail = async (data: NotificationData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const template = getEmailTemplate(data.type, data);
      
      const emailParams = {
        to_email: data.customerEmail,
        to_name: data.customerName,
        subject: template.subject,
        html_content: template.html,
        order_id: data.orderId,
        from_name: 'Avaxen Pharmacy'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailParams
      );

      if (response.status === 200) {
        showToast('success', 'Email Sent', `Notification sent to ${data.customerEmail}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Email sending failed:', error);
      showToast('error', 'Email Failed', 'Could not send notification email');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotification = async (data: NotificationData): Promise<boolean> => {
    // Send both email and toast notification
    const emailSent = await sendEmail(data);
    
    // Show appropriate toast based on notification type
    const notificationMessages = {
      order_placed: { title: '✅ Order Confirmed', description: `Order #${data.orderId} has been placed successfully` },
      order_confirmed: { title: '🏥 Order Confirmed', description: 'Your order has been confirmed by the pharmacy' },
      driver_assigned: { title: '🚚 Driver Assigned', description: `${data.deliveryAgent?.name} will deliver your order` },
      out_for_delivery: { title: '📦 Out for Delivery', description: `Your order is on the way! ETA: ${data.estimatedTime}` },
      delivered: { title: '🎉 Order Delivered', description: 'Your medicines have been delivered successfully' },
      prescription_uploaded: { title: '📄 Prescription Uploaded', description: 'Your prescription has been received and is being processed' }
    };

    const message = notificationMessages[data.type];
    showToast('success', message.title, message.description);

    return emailSent;
  };

  const showToast = (type: string, message: string, description?: string) => {
    switch (type) {
      case 'success':
        toast.success(message, { description });
        break;
      case 'error':
        toast.error(message, { description });
        break;
      case 'info':
        toast.info(message, { description });
        break;
      default:
        toast(message, { description });
    }
  };

  return {
    sendNotification,
    sendEmail,
    showToast,
    isLoading
  };
}
