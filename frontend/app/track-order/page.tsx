"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, MapPin, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { orderApi } from "@/lib/api"

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const order = searchParams.get("order")
    if (order) {
      setOrderNumber(order)
      trackOrder(order)
    }
  }, [searchParams])

  const trackOrder = async (orderNum: string) => {
    setIsLoading(true)

    try {
      const response = await orderApi.getOrderByNumber(orderNum)
      if (response.success) {
        setOrderData({
          orderNumber: response.order.orderNumber,
          status: response.order.status,
          estimatedDelivery: response.order.estimatedDelivery,
          items: response.order.items,
          total: response.order.totalAmount,
          timeline: response.order.trackingUpdates || []
        })
      } else {
        // Order not found, show sample data or error
        setOrderData(null)
      }
    } catch (error) {
      console.error('Failed to track order:', error)
      // Fallback to simulated data for demo
      setOrderData({
        orderNumber: orderNum,
        status: "In Transit",
        estimatedDelivery: "Tomorrow, 2:00 PM",
        items: [
          { name: "Paracetamol 500mg", quantity: 2, price: 90 },
          { name: "Cetirizine 10mg", quantity: 1, price: 85 },
        ],
        total: 175,
        timeline: [
          { status: "Order Placed", time: "Today, 10:30 AM", completed: true },
          { status: "Order Confirmed", time: "Today, 10:45 AM", completed: true },
          { status: "Packed", time: "Today, 2:15 PM", completed: true },
          { status: "Out for Delivery", time: "Tomorrow, 9:00 AM", completed: false },
          { status: "Delivered", time: "Tomorrow, 2:00 PM", completed: false },
        ],
      })
    }
    setIsLoading(false)
  }

  const handleTrack = () => {
    if (orderNumber.trim()) {
      trackOrder(orderNumber)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Track Your Order</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Enter Order Number</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your order number (e.g., BRS123456789)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTrack()}
              />
              <Button onClick={handleTrack} disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Tracking..." : "Track"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        {orderData && (
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{orderData.orderNumber}</span>
                  <Badge className="bg-blue-100 text-blue-800">{orderData.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Estimated Delivery</h3>
                    <p className="text-gray-600">{orderData.estimatedDelivery}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Order Total</h3>
                    <p className="text-lg font-bold text-green-600">₹{orderData.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.timeline.map((step: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}>
                          {step.status}
                        </h4>
                        <p className="text-sm text-gray-500">{step.time}</p>
                      </div>
                      <div>
                        {step.status === "Order Placed" && <Package className="h-5 w-5 text-gray-400" />}
                        {step.status === "Out for Delivery" && <Truck className="h-5 w-5 text-gray-400" />}
                        {step.status === "Delivered" && <MapPin className="h-5 w-5 text-gray-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/medicines">Order Again</Link>
              </Button>
              <Button variant="outline">Contact Support</Button>
            </div>
          </div>
        )}

        {/* No Order Found */}
        {orderNumber && !orderData && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find an order with number "{orderNumber}". Please check the order number and try again.
              </p>
              <Button variant="outline" onClick={() => setOrderNumber("")}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
