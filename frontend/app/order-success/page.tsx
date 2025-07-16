"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Home } from "lucide-react"
import Link from "next/link"

export default function OrderSuccessPage() {
  const orderNumber = "BRS" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">Thank you for your order. We'll process it shortly.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="font-bold text-lg">{orderNumber}</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Package className="h-4 w-4 mr-3 text-blue-500" />
              <span>Order confirmed and being prepared</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Truck className="h-4 w-4 mr-3 text-orange-500" />
              <span>Expected delivery: Tomorrow</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" asChild>
              <Link href={`/track-order?order=${orderNumber}`}>Track Your Order</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/medicines">Continue Shopping</Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
