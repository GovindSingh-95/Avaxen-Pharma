"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Heart, MapPin, Truck, ArrowLeft, Edit, Plus, Package, Star, Trash2, Save, X } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { getMedicineById, type Medicine } from "@/lib/medicine-database"

interface Order {
  id: string
  date: string
  items: Array<{
    medicineId: number
    quantity: number
    price: number
  }>
  total: number
  status: "Delivered" | "In Transit" | "Processing" | "Cancelled"
}

interface Address {
  id: string
  type: "Home" | "Work" | "Other"
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function ProfilePage() {
  const [wishlistItems, setWishlistItems] = useState<number[]>([])
  const [wishlistMedicines, setWishlistMedicines] = useState<Medicine[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+91 98765 43210",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile)

  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "orders"
  const [activeTab, setActiveTab] = useState(initialTab)

  // Load data from localStorage
  useEffect(() => {
    // Load wishlist
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      const wishlistIds = JSON.parse(savedWishlist) as number[]
      setWishlistItems(wishlistIds)

      // Get medicine details for wishlist
      const medicines = wishlistIds.map((id) => getMedicineById(id)).filter(Boolean) as Medicine[]
      setWishlistMedicines(medicines)
    }

    // Load or create sample orders
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    } else {
      // Create sample orders
      const sampleOrders: Order[] = [
        {
          id: "ORD001",
          date: "2024-01-15",
          items: [
            { medicineId: 1, quantity: 2, price: 45 },
            { medicineId: 2, quantity: 1, price: 85 },
          ],
          total: 175,
          status: "Delivered",
        },
        {
          id: "ORD002",
          date: "2024-01-10",
          items: [
            { medicineId: 4, quantity: 1, price: 125 },
            { medicineId: 3, quantity: 1, price: 320 },
          ],
          total: 445,
          status: "Delivered",
        },
      ]
      setOrders(sampleOrders)
      localStorage.setItem("orders", JSON.stringify(sampleOrders))
    }

    // Load or create sample addresses
    const savedAddresses = localStorage.getItem("addresses")
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses))
    } else {
      const sampleAddresses: Address[] = [
        {
          id: "addr1",
          type: "Home",
          name: "John Doe",
          phone: "+91 98765 43210",
          address: "123 Main Street, Apartment 4B",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          isDefault: true,
        },
      ]
      setAddresses(sampleAddresses)
      localStorage.setItem("addresses", JSON.stringify(sampleAddresses))
    }

    // Load user profile
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setUserProfile(profile)
      setEditedProfile(profile)
    }
  }, [])

  // Update tab when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const removeFromWishlist = (medicineId: number) => {
    const updatedWishlist = wishlistItems.filter((id) => id !== medicineId)
    setWishlistItems(updatedWishlist)
    setWishlistMedicines((prev) => prev.filter((med) => med.id !== medicineId))
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
  }

  const addToCart = (medicineId: number) => {
    const savedCart = localStorage.getItem("cart")
    const currentCart = savedCart ? JSON.parse(savedCart) : []
    const updatedCart = [...currentCart, medicineId]
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    // Show success message
    const medicine = getMedicineById(medicineId)
    alert(`${medicine?.name} added to cart!`)
  }

  const reorderItems = (order: Order) => {
    const savedCart = localStorage.getItem("cart")
    const currentCart = savedCart ? JSON.parse(savedCart) : []

    // Add all items from the order to cart
    const itemsToAdd: number[] = []
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        itemsToAdd.push(item.medicineId)
      }
    })

    const updatedCart = [...currentCart, ...itemsToAdd]
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    alert("Items added to cart!")
    router.push("/cart")
  }

  const saveProfile = () => {
    // Validate required fields
    if (!editedProfile.firstName.trim() || !editedProfile.lastName.trim() || !editedProfile.email.trim()) {
      alert("Please fill in all required fields")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editedProfile.email)) {
      alert("Please enter a valid email address")
      return
    }

    setUserProfile(editedProfile)
    localStorage.setItem("userProfile", JSON.stringify(editedProfile))
    setIsEditing(false)
    alert("Profile updated successfully!")
  }

  const cancelEdit = () => {
    setEditedProfile(userProfile)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getOrderItemsText = (order: Order) => {
    return order.items
      .map((item) => {
        const medicine = getMedicineById(item.medicineId)
        return medicine ? `${medicine.name} (${item.quantity})` : `Medicine ${item.medicineId} (${item.quantity})`
      })
      .join(", ")
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500"
      case "In Transit":
        return "bg-blue-500"
      case "Processing":
        return "bg-yellow-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-blue-600 text-white">
                {userProfile.firstName[0]}
                {userProfile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">
                {userProfile.firstName} {userProfile.lastName}
              </h1>
              <p className="text-gray-600">{userProfile.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Your Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">₹{order.total}</div>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">{getOrderItemsText(order)}</div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/track-order?order=${order.id}`}>
                              <Truck className="h-4 w-4 mr-2" />
                              Track
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => reorderItems(order)}>
                            <Package className="h-4 w-4 mr-2" />
                            Reorder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No orders yet</p>
                    <Button asChild>
                      <Link href="/medicines">Start Shopping</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Your Wishlist ({wishlistMedicines.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wishlistMedicines.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {wishlistMedicines.map((medicine) => (
                      <div key={medicine.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <img
                            src={medicine.image || "/placeholder.svg"}
                            alt={medicine.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{medicine.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{medicine.manufacturer}</p>
                            <div className="flex items-center mb-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">{medicine.rating}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-green-600">₹{medicine.price}</span>
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ₹{medicine.originalPrice}
                                </span>
                              </div>
                              <Badge
                                className={medicine.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                              >
                                {medicine.inStock ? "In Stock" : "Out of Stock"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button
                            size="sm"
                            className="flex-1"
                            disabled={!medicine.inStock}
                            onClick={() => addToCart(medicine.id)}
                          >
                            Add to Cart
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => removeFromWishlist(medicine.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                    <Button asChild>
                      <Link href="/medicines">Browse Medicines</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Saved Addresses
                  </span>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className="mb-2">{address.type}</Badge>
                              {address.isDefault && <Badge variant="outline">Default</Badge>}
                            </div>
                            <h3 className="font-medium">{address.name}</h3>
                            <p className="text-gray-600 text-sm">
                              {address.address}
                              <br />
                              {address.city}, {address.state} {address.pincode}
                              <br />
                              {address.phone}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No addresses saved</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Personal Information
                  </span>
                  {!isEditing ? (
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={saveProfile}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={isEditing ? editedProfile.firstName : userProfile.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={isEditing ? editedProfile.lastName : userProfile.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editedProfile.email : userProfile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={isEditing ? editedProfile.phone : userProfile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                  />
                </div>

                {isEditing && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Fields marked with * are required. Make sure to enter a valid email
                      address.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
