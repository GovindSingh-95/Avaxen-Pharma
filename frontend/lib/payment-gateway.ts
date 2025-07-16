// Payment Gateway Integration (Razorpay for Indian market)
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

// Razorpay integration for Indian market
export class RazorpayGateway {
  private keyId: string
  private keySecret: string

  constructor() {
    // In production, these would come from environment variables
    this.keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_demo"
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || "demo_secret"
  }

  async createOrder(amount: number, currency = "INR"): Promise<string> {
    // Simulate order creation
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return orderId
  }

  async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        const success = Math.random() > 0.05

        if (success) {
          resolve({
            success: true,
            paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            orderId: details.orderId,
            signature: `sig_${Math.random().toString(36).substr(2, 16)}`,
          })
        } else {
          resolve({
            success: false,
            error: "Payment failed. Please try again.",
          })
        }
      }, 2000) // Simulate network delay
    })
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
