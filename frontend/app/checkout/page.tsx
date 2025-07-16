"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Banknote, MapPin, User, Shield, Truck, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getMedicineById, type Medicine } from "@/lib/medicine-database"
import { paymentMethods, razorpayGateway, type PaymentDetails } from "@/lib/payment-gateway"

interface CartItem extends Medicine {
  quantity: number
}

interface CustomerDetails {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("razorpay")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const router = useRouter()

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const cartIds = JSON.parse(savedCart) as number[]
      const items: CartItem[] = []

      // Count quantities and get medicine details
      const itemCounts: { [key: number]: number } = {}
      cartIds.forEach((id) => {
        itemCounts[id] = (itemCounts[id] || 0) + 1
      })

      Object.entries(itemCounts).forEach(([id, quantity]) => {
        const medicine = getMedicineById(Number(id))
        if (medicine) {
          items.push({ ...medicine, quantity })
        }
      })

      setCartItems(items)
    }

    // Load saved customer details
    const savedDetails = localStorage.getItem("customerDetails")
    if (savedDetails) {
      setCustomerDetails(JSON.parse(savedDetails))
    }
  }, [])

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart")
    }
  }, [cartItems, router])

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!customerDetails.name.trim()) newErrors.name = "Name is required"
    if (!customerDetails.email.trim()) newErrors.email = "Email is required"
    if (!customerDetails.phone.trim()) newErrors.phone = "Phone is required"
    if (!customerDetails.address.trim()) newErrors.address = "Address is required"
    if (!customerDetails.city.trim()) newErrors.city = "City is required"
    if (!customerDetails.state.trim()) newErrors.state = "State is required"
    if (!customerDetails.pincode.trim()) newErrors.pincode = "Pincode is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (customerDetails.email && !emailRegex.test(customerDetails.email)) {
      newErrors.email = "Please enter a valid email"
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/
    if (customerDetails.phone && !phoneRegex.test(customerDetails.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    // Pincode validation
    const pincodeRegex = /^\d{6}$/
    if (customerDetails.pincode && !pincodeRegex.test(customerDetails.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      // Save customer details
      localStorage.setItem("customerDetails", JSON.stringify(customerDetails))

      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const deliveryFee = subtotal > 500 ? 0 : 50
      const total = subtotal + deliveryFee

      // Create order
      const orderId = await razorpayGateway.createOrder(total)

      // Process payment based on selected method
      if (selectedPaymentMethod === "cod") {
        // Cash on Delivery - Skip payment processing
        setTimeout(() => {
          // Clear cart and redirect
          localStorage.removeItem("cart")
          localStorage.setItem(
            "lastOrder",
            JSON.stringify({
              orderId,
              items: cartItems,
              total,
              paymentMethod: "Cash on Delivery",
              customerDetails,
              orderDate: new Date().toISOString(),
            }),
          )
          router.push("/order-success")
        }, 1000)
      } else {
        // Online payment
        const paymentDetails: PaymentDetails = {
          amount: total,
          currency: "INR",
          orderId,
          customerName: customerDetails.name,
          customerEmail: customerDetails.email,
          customerPhone: customerDetails.phone,
        }

        const result = await razorpayGateway.processPayment(paymentDetails)

        if (result.success) {
          // Clear cart and redirect
          localStorage.removeItem("cart")
          localStorage.setItem(
            "lastOrder",
            JSON.stringify({
              orderId,
              paymentId: result.paymentId,
              items: cartItems,
              total,
              paymentMethod: paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name,
              customerDetails,
              orderDate: new Date().toISOString(),
            }),
          )
          router.push("/order-success")
        } else {
          alert(result.error || "Payment failed. Please try again.")
        }
      }
    } catch (error) {
      console.error("Order processing error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 500 ? 0 : 50
  const total = subtotal + deliveryFee

  if (cartItems.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-40">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Checkout</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Customer Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerDetails.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customerDetails.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="10-digit mobile number"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Delivery Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    value={customerDetails.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="House/Flat No., Street, Area"
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerDetails.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={customerDetails.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={customerDetails.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      placeholder="6-digit code"
                      className={errors.pincode ? "border-red-500" : ""}
                    />
                    {errors.pincode && <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                      {method.id === "cod" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          No advance payment
                        </Badge>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card>
              <CardContent className="space-y-3 pt-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center text-sm text-green-600">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>Delivery by tomorrow</span>
                </div>
                <div className="flex items-center text-sm text-blue-600">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>100% genuine medicines</span>
                </div>
                <div className="flex items-center text-sm text-purple-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Secure payment</span>
                </div>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={isProcessing || cartItems.length === 0}
            >
              {isProcessing ? (
                "Processing Order..."
              ) : (
                <>
                  {selectedPaymentMethod === "cod" ? (
                    <>
                      <Banknote className="h-4 w-4 mr-2" />
                      Place Order - ₹{total} (COD)
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now - ₹{total}
                    </>
                  )}
                </>
              )}
            </Button>

            {selectedPaymentMethod === "cod" && (
              <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Cash on Delivery: Pay ₹{total} when you receive your order
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
