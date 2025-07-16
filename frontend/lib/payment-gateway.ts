// Payment Gateway Integration (Razorpay for Indian market)
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentDetails {
  amount: number
  currency: string
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  orderId?: string
  signature?: string
  error?: string
}

// Load Razorpay script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// Razorpay integration for Indian market
export class RazorpayGateway {
  private keyId: string

  constructor() {
    // Use demo key for testing - replace with your actual key
    this.keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_9WdUFUmBhJWZX6"
    console.log("Payment gateway initialized with key:", this.keyId.slice(0, 10) + "...")
  }

  async createOrder(amount: number, currency = "INR"): Promise<string> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paisa
          currency
        })
      })

      const data = await response.json()
      
      if (data.success) {
        return data.data.id // Razorpay order ID
      } else {
        throw new Error(data.message || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      // Fallback to demo order ID
      return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      
      if (!scriptLoaded) {
        return {
          success: false,
          error: "Payment gateway failed to load. Please try again."
        }
      }

      return new Promise((resolve) => {
        const options = {
          key: this.keyId,
          amount: details.amount * 100, // Convert to paisa
          currency: details.currency,
          name: "Avaxen Pharma",
          description: "Medicine Order Payment",
          image: "/placeholder-logo.png",
          order_id: details.orderId,
          handler: function (response: any) {
            resolve({
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            })
          },
          prefill: {
            name: details.customerName,
            email: details.customerEmail,
            contact: details.customerPhone
          },
          notes: {
            address: "Avaxen Pharma Order"
          },
          theme: {
            color: "#2563eb"
          },
          modal: {
            ondismiss: function() {
              resolve({
                success: false,
                error: "Payment cancelled by user"
              })
            }
          }
        }

        const rzp = new window.Razorpay(options)
        
        rzp.on('payment.failed', function (response: any) {
          resolve({
            success: false,
            error: response.error.description || "Payment failed"
          })
        })

        rzp.open()
      })
    } catch (error) {
      console.error('Payment processing error:', error)
      return {
        success: false,
        error: "Payment processing failed. Please try again."
      }
    }
  }
}

// Alternative payment methods
export const paymentMethods = [
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Credit/Debit Cards, UPI, Net Banking",
    icon: "💳",
    enabled: true,
  },
  {
    id: "upi",
    name: "UPI",
    description: "Pay using any UPI app",
    icon: "📱",
    enabled: true,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when you receive",
    icon: "💵",
    enabled: true,
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    description: "Paytm, PhonePe, Google Pay",
    icon: "👛",
    enabled: true,
  },
]

export const razorpayGateway = new RazorpayGateway()
