"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, ShoppingCart, Heart, ArrowLeft, Filter, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { searchMedicines, getAllCategories, getMedicineById, type Medicine } from "@/lib/medicine-database"
import MedicineImage from "@/components/ui/medicine-image"

export default function MedicinesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [cartItems, setCartItems] = useState<number[]>([])
  const [wishlistItems, setWishlistItems] = useState<number[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [showMedicineModal, setShowMedicineModal] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedWishlist = localStorage.getItem("wishlist")

    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    }
  }, [])

  // Save cart and wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  // Get search and category from URL params and perform search
  useEffect(() => {
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || "all"

    setSearchTerm(search)
    setSelectedCategory(category)

    // Perform search with current filters
    performSearch(search, category)
  }, [searchParams])

  // Perform search whenever filters change
  useEffect(() => {
    performSearch(searchTerm, selectedCategory)
  }, [searchTerm, selectedCategory])

  const performSearch = (search: string, category: string) => {
    const results = searchMedicines(search, category === "all" ? undefined : category)
    setMedicines(results)
  }

  const categories = ["all", ...getAllCategories()]

  const sortedMedicines = [...medicines].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const addToCart = (medicineId: number) => {
    setCartItems((prev) => {
      const newCart = [...prev, medicineId]
      const medicine = getMedicineById(medicineId)
      if (medicine) {
        alert(`${medicine.name} added to cart!`)
      }
      return newCart
    })
  }

  const toggleWishlist = (medicineId: number) => {
    setWishlistItems((prev) => {
      const isInWishlist = prev.includes(medicineId)
      const medicine = getMedicineById(medicineId)

      if (isInWishlist) {
        alert(`${medicine?.name} removed from wishlist`)
        return prev.filter((id) => id !== medicineId)
      } else {
        alert(`${medicine?.name} added to wishlist`)
        return [...prev, medicineId]
      }
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL()
  }

  const updateURL = () => {
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set("search", searchTerm.trim())
    if (selectedCategory !== "all") params.set("category", selectedCategory)
    router.push(`/medicines?${params.toString()}`)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    // URL will be updated by useEffect
  }

  const viewMedicineDetails = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setShowMedicineModal(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    router.push("/medicines")
  }

  const openWishlist = () => {
    router.push("/profile?tab=wishlist")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">All Medicines</h1>
            <Badge variant="secondary">{sortedMedicines.length} medicines</Badge>
          </div>

          {/* Search and Filters */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search medicines, manufacturers, uses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit">
              <Filter className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600">
              {sortedMedicines.length} medicines found
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <Button variant="link" onClick={clearFilters} className="p-0 h-auto text-blue-600">
                Clear all filters
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cartItems.length})
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={openWishlist}>
              <Heart className="h-4 w-4 mr-2" />
              Wishlist ({wishlistItems.length})
            </Button>
          </div>
        </div>

        {sortedMedicines.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedMedicines.map((medicine) => (
              <Card key={medicine.id} className="hover:shadow-lg transition-shadow border-0 bg-white">
                <CardContent className="p-4">
                  <div className="relative mb-3">
                    <MedicineImage
                      src={medicine.image}
                      alt={medicine.name}
                      category={medicine.category}
                      form={medicine.form}
                      className="w-full h-32 object-cover rounded-lg"
                      fallbackType="category"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white"
                      onClick={() => toggleWishlist(medicine.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          wishlistItems.includes(medicine.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                      />
                    </Button>
                    {medicine.prescription && <Badge className="absolute top-2 left-2 bg-red-500 text-xs">Rx</Badge>}
                    {!medicine.inStock && (
                      <Badge className="absolute bottom-2 left-2 bg-gray-500 text-xs">Out of Stock</Badge>
                    )}
                  </div>

                  <Badge variant="secondary" className="mb-2 text-xs">
                    {medicine.category}
                  </Badge>

                  <h3 className="font-medium mb-1 line-clamp-2">{medicine.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{medicine.manufacturer}</p>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{medicine.description}</p>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(medicine.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {medicine.rating} ({medicine.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-green-600">₹{medicine.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">₹{medicine.originalPrice}</span>
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      {Math.round(((medicine.originalPrice - medicine.price) / medicine.originalPrice) * 100)}% off
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="sm"
                      disabled={!medicine.inStock}
                      onClick={() => addToCart(medicine.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {medicine.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => viewMedicineDetails(medicine)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
            </div>
            <p className="text-gray-500 text-lg mb-4">No medicines found matching your criteria.</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Medicine Details Modal */}
      {showMedicineModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedMedicine.name}</h2>
                  <p className="text-gray-600">{selectedMedicine.manufacturer}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowMedicineModal(false)}>
                  ×
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <MedicineImage
                    src={selectedMedicine.image}
                    alt={selectedMedicine.name}
                    category={selectedMedicine.category}
                    form={selectedMedicine.form}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    fallbackType="category"
                  />

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Price</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">₹{selectedMedicine.price}</span>
                        <span className="text-gray-500 line-through">₹{selectedMedicine.originalPrice}</span>
                        <Badge className="bg-green-100 text-green-800">
                          {Math.round(
                            ((selectedMedicine.originalPrice - selectedMedicine.price) /
                              selectedMedicine.originalPrice) *
                              100,
                          )}
                          % off
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Rating</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(selectedMedicine.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span>
                          {selectedMedicine.rating} ({selectedMedicine.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Basic Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Generic Name:</strong> {selectedMedicine.genericName}
                      </p>
                      <p>
                        <strong>Category:</strong> {selectedMedicine.category}
                      </p>
                      <p>
                        <strong>Strength:</strong> {selectedMedicine.strength}
                      </p>
                      <p>
                        <strong>Form:</strong> {selectedMedicine.form}
                      </p>
                      <p>
                        <strong>Active Ingredient:</strong> {selectedMedicine.activeIngredient}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Uses</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedMedicine.uses.map((use, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Dosage</h4>
                    <p className="text-sm text-gray-700">{selectedMedicine.dosage}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Side Effects</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {selectedMedicine.sideEffects.map((effect, index) => (
                        <li key={index}>• {effect}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Precautions</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {selectedMedicine.precautions.map((precaution, index) => (
                        <li key={index}>• {precaution}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  className="flex-1"
                  disabled={!selectedMedicine.inStock}
                  onClick={() => {
                    addToCart(selectedMedicine.id)
                    setShowMedicineModal(false)
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {selectedMedicine.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" onClick={() => toggleWishlist(selectedMedicine.id)}>
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      wishlistItems.includes(selectedMedicine.id) ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  {wishlistItems.includes(selectedMedicine.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
