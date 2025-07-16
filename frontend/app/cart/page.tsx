"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, Truck, Shield, CreditCard, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getMedicineById, type Medicine } from "@/lib/medicine-database"

interface CartItem extends Medicine {
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

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
  }, [])

  // Save cart to localStorage
  const saveCartToStorage = (items: CartItem[]) => {
    const cartIds: number[] = []
    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        cartIds.push(item.id)
      }
    })
    localStorage.setItem("cart", JSON.stringify(cartIds))
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems((items) => {
      const updatedItems = items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      saveCartToStorage(updatedItems)
      return updatedItems
    })
  }

  const removeItem = (id: number) => {
    setCartItems((items) => {
      const updatedItems = items.filter((item) => item.id !== id)
      saveCartToStorage(updatedItems)
      return updatedItems
    })
  }

  const applyPromoCode = () => {
    const code = promoCode.toLowerCase()
    if (code === "save10") {
      setAppliedPromo(promoCode)
      setPromoDiscount(subtotal * 0.1) // 10% discount
      setPromoCode("")
    } else if (code === "first20") {
      setAppliedPromo(promoCode)
      setPromoDiscount(Math.min(subtotal * 0.2, 100)) // 20% discount, max ₹100
      setPromoCode("")
    } else if (code === "welcome50") {
      setAppliedPromo(promoCode)
      setPromoDiscount(50) // Flat ₹50 off
      setPromoCode("")
    } else {
      alert("Invalid promo code. Try: SAVE10, FIRST20, or WELCOME50")
    }
  }

  const removePromoCode = () => {
    setAppliedPromo("")
    setPromoDiscount(0)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    router.push("/checkout")
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0)
  const deliveryFee = subtotal > 500 ? 0 : 50
  const finalTotal = Math.max(0, subtotal + deliveryFee - promoDiscount)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Your Cart</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-16">
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some medicines to get started</p>
              <Button asChild>
                <Link href="/medicines">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-40">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/medicines">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Your Cart</h1>
            <span className="text-gray-500">({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{item.manufacturer}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        {item.strength} • {item.form}
                      </p>

                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                        <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                        {item.prescription && <Badge className="bg-red-500 text-xs">Rx</Badge>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 font-medium">{item.quantity}</span>
                          <Button size="sm" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">₹{item.price * item.quantity}</span>
                          <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <div className="text-center pt-4">
              <Button variant="outline" asChild>
                <Link href="/medicines">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Promo Code */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Have a promo code?</h3>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">{appliedPromo}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={removePromoCode}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && applyPromoCode()}
                      />
                      <Button variant="outline" onClick={applyPromoCode}>
                        Apply
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Try: <span className="font-mono">SAVE10</span> (10% off),{" "}
                      <span className="font-mono">FIRST20</span> (20% off), or{" "}
                      <span className="font-mono">WELCOME50</span> (₹50 off)
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{subtotal}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You save</span>
                    <span>-₹{savings}</span>
                  </div>
                )}

                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo discount ({appliedPromo})</span>
                    <span>-₹{promoDiscount.toFixed(0)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(0)}</span>
                </div>

                {subtotal < 500 && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    Add ₹{500 - subtotal} more for FREE delivery!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center text-sm text-green-600">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>Delivery by tomorrow</span>
                </div>
                <div className="flex items-center text-sm text-blue-600">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>100% genuine medicines</span>
                </div>
                <div className="flex items-center text-sm text-purple-600">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Secure payment</span>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button size="lg" className="w-full" onClick={handleCheckout} disabled={cartItems.length === 0}>
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Checkout - ₹{finalTotal.toFixed(0)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
