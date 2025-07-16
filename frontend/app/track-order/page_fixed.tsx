"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, MapPin, ArrowLeft, Search, Phone, Clock, Shield, Navigation } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { orderApi } from "@/lib/order-api"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const DeliveryMap = dynamic(
  () => import("@/components/ui/delivery-map").then(mod => ({ default: mod.DeliveryMap })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
)

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setError(null)

    try {
      const response = await orderApi.getOrderByNumber(orderNum)
      if (response.success) {
        setOrderData({
          orderNumber: response.order.orderNumber,
          status: response.order.status,
          estimatedDelivery: response.order.estimatedDelivery,
          deliveryPartner: "Avaxen Express",
          deliveryAgent: response.order.deliveryAgent,
          pharmacyDetails: response.order.pharmacyDetails,
          pharmacyLocation: response.order.pharmacyLocation,
          deliveryLocation: response.order.deliveryLocation,
          currentLocation: response.order.currentLocation,
          items: response.order.items.map((item: any) => ({
            name: item.medicine.name,
            quantity: item.quantity,
            price: item.price,
            prescriptionRequired: item.medicine.prescriptionRequired,
            batchNo: item.medicine.batchNo,
            expiryDate: item.medicine.expiryDate
          })),
          total: response.order.totalAmount,
          timeline: response.order.trackingUpdates || [],
          specialInstructions: response.order.items[0]?.medicine?.storageInstructions || [
            "Keep medicines in cool, dry place",
            "Store away from children"
          ]
        })
      } else {
        setError("Order not found. Please check your order number and try again.")
        setOrderData(null)
      }
    } catch (error: any) {
      console.error('Failed to track order:', error)
      
      // Check if it's a 404 error
      if (error.message?.includes('Order not found') || error.status === 404) {
        setError("Order not found. Please check your order number and try again.")
        setOrderData(null)
      } else {
        // Show demo data for demonstration purposes
        setError("Unable to fetch live tracking data. Showing demo data.")
        setOrderData({
          orderNumber: orderNum,
          status: "Out for Delivery",
          estimatedDelivery: "Tomorrow, 2:00 PM",
          deliveryPartner: "Avaxen Express",
          deliveryAgent: {
            name: "Rajesh Kumar",
            phone: "+91 98765 43210",
            vehicle: "Bike - MH12AB1234"
          },
          pharmacyDetails: {
            name: "HealthCare Pharmacy",
            license: "DL-12345-2024",
            pharmacist: "Dr. Priya Sharma"
          },
          items: [
            { 
              name: "Paracetamol 500mg", 
              quantity: 2, 
              price: 90,
              prescriptionRequired: false,
              batchNo: "PCT240115",
              expiryDate: "Dec 2025"
            },
            { 
              name: "Cetirizine 10mg", 
              quantity: 1, 
              price: 85,
              prescriptionRequired: true,
              batchNo: "CTZ240118", 
              expiryDate: "Nov 2025"
            },
          ],
          total: 175,
          deliveryLocation: {
            lat: 19.0760,
            lng: 72.8777,
            address: "123 Main Street, Mumbai, Maharashtra 400001"
          },
          pharmacyLocation: {
            lat: 19.0800,
            lng: 72.8750,
            name: "HealthCare Pharmacy"
          },
          currentLocation: {
            lat: 19.0780,
            lng: 72.8765
          },
          timeline: [
            { 
              status: "Order Placed", 
              time: "Today, 10:30 AM", 
              completed: true,
              description: "Your order has been placed successfully",
              location: "Mumbai"
            },
            { 
              status: "Order Confirmed", 
              time: "Today, 11:15 AM", 
              completed: true,
              description: "Pharmacy confirmed your order",
              location: "HealthCare Pharmacy"
            },
            { 
              status: "Processing", 
              time: "Today, 2:45 PM", 
              completed: true,
              description: "Your medicines are being prepared",
              location: "HealthCare Pharmacy"
            },
            { 
              status: "Packed", 
              time: "Today, 3:30 PM", 
              completed: true,
              description: "Order packed and ready for pickup",
              location: "HealthCare Pharmacy"
            },
            { 
              status: "In Transit", 
              time: "Today, 4:15 PM", 
              completed: true,
              description: "On the way to your location",
              location: "Bandra West"
            },
            { 
              status: "Delivered", 
              time: "Tomorrow, 2:00 PM", 
              completed: false,
              description: "Delivery to your doorstep",
              location: "Your Address"
            },
          ],
          specialInstructions: [
            "Keep medicines in cool, dry place",
            "Take Cetirizine after meals",
            "Store away from children"
          ]
        })
      }
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
            <h1 className="text-2xl font-bold">🚚 Track Your Medicine Delivery</h1>
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
                placeholder="Enter your order number (e.g., AV98175350)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTrack()}
              />
              <Button onClick={handleTrack} disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Tracking..." : "Track"}
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              💡 Try the sample order: <Button 
                variant="link" 
                className="p-0 h-auto text-blue-600" 
                onClick={() => {setOrderNumber("AV98175350"); trackOrder("AV98175350")}}
              >
                AV98175350
              </Button>
            </p>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="text-red-600">⚠️</div>
                <div>
                  <h3 className="font-semibold text-red-800">Notice</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="space-y-6">
            {/* Order Status Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{orderData.orderNumber}</span>
                  <Badge className="bg-blue-100 text-blue-800">{orderData.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Estimated Delivery
                    </h3>
                    <p className="text-gray-600">{orderData.estimatedDelivery}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      Delivery Partner
                    </h3>
                    <p className="text-gray-600">{orderData.deliveryPartner}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Total Amount</h3>
                    <p className="text-xl font-bold text-green-600">₹{orderData.total}</p>
                  </div>
                </div>

                {/* Delivery Agent Info */}
                {orderData.deliveryAgent && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Delivery Agent Details
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {orderData.deliveryAgent.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span className="font-medium">Phone:</span> {orderData.deliveryAgent.phone}
                      </div>
                      <div>
                        <span className="font-medium">Vehicle:</span> {orderData.deliveryAgent.vehicle}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pharmacy Details */}
                {orderData.pharmacyDetails && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center">
                      🏥 Pharmacy Information
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Pharmacy:</span> {orderData.pharmacyDetails.name}
                      </div>
                      <div>
                        <span className="font-medium">License:</span> {orderData.pharmacyDetails.license}
                      </div>
                      <div>
                        <span className="font-medium">Pharmacist:</span> {orderData.pharmacyDetails.pharmacist}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Delivery Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="h-5 w-5 mr-2" />
                  Live Delivery Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderData.pharmacyLocation && orderData.deliveryLocation && (
                  <DeliveryMap
                    pharmacyLocation={orderData.pharmacyLocation}
                    deliveryLocation={orderData.deliveryLocation}
                    currentLocation={orderData.currentLocation}
                    deliveryStatus={orderData.status}
                  />
                )}
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">🏥</span>
                    </div>
                    <span>Pharmacy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">🚚</span>
                    </div>
                    <span>Delivery Agent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">🏠</span>
                    </div>
                    <span>Your Location</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medicine Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  💊 Medicine Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                          <div>Quantity: {item.quantity}</div>
                          {item.batchNo && <div>Batch No: {item.batchNo}</div>}
                          {item.expiryDate && <div>Expiry: {item.expiryDate}</div>}
                          <div className="flex items-center gap-2">
                            {item.prescriptionRequired ? (
                              <Badge variant="destructive" className="text-xs">Prescription Required</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">OTC Medicine</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                        <p className="text-sm text-gray-600">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.timeline.map((event: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {event.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{event.status}</h4>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            <p className="text-xs text-gray-500 mt-1">📍 {event.location}</p>
                          </div>
                          <span className="text-sm text-gray-500">{event.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            {orderData.specialInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Medicine Safety Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {orderData.specialInstructions.map((instruction: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span>{instruction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Support */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Phone className="h-8 w-8 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-800">Need Help?</h3>
                    <p className="text-sm text-orange-700">Contact our pharmacy support team</p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    Call Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {orderData === null && !error && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Enter Order Number</h3>
              <p className="text-gray-600">
                Enter your order number above to track your medicine delivery.
              </p>
            </CardContent>
          </Card>
        )}

        {error && orderData === null && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-gray-600">
                Please check your order number and try again. Contact support if you need assistance.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
