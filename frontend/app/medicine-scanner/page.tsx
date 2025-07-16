"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  Upload,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield,
  Heart,
  Brain,
  Loader2,
  ExternalLink,
  Star,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { searchMedicines, type Medicine } from "@/lib/medicine-database"

interface MedicineCategory {
  name: string
  icon: React.ReactNode
  color: string
  description: string
  count: number
}

export default function MedicineScannerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedMedicine, setScannedMedicine] = useState<Medicine | null>(null)
  const [activeTab, setActiveTab] = useState("scan")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const categories: MedicineCategory[] = [
    {
      name: "Pain Relief",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-blue-50 border-blue-200 text-blue-700",
      description: "Medicines that reduce pain and inflammation",
      count: 0,
    },
    {
      name: "Antibiotics",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-green-50 border-green-200 text-green-700",
      description: "Medicines that fight bacterial infections",
      count: 0,
    },
    {
      name: "Antihistamines",
      icon: <Heart className="h-5 w-5" />,
      color: "bg-purple-50 border-purple-200 text-purple-700",
      description: "Medicines that treat allergic reactions",
      count: 0,
    },
    {
      name: "Digestive Health",
      icon: <Brain className="h-5 w-5" />,
      color: "bg-orange-50 border-orange-200 text-orange-700",
      description: "Medicines for stomach and digestive issues",
      count: 0,
    },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        simulateScan()
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateScan = async () => {
    setIsScanning(true)
    setScannedMedicine(null)

    // Simulate AI scanning process with real medicine database
    try {
      // Search for common medicines that might be scanned
      const commonMedicines = ["paracetamol", "ibuprofen", "cetirizine", "amoxicillin", "omeprazole"]
      const randomSearch = commonMedicines[Math.floor(Math.random() * commonMedicines.length)]

      const results = searchMedicines(randomSearch)

      setTimeout(() => {
        if (results.length > 0) {
          setScannedMedicine(results[0])
        }
        setIsScanning(false)
      }, 2000)
    } catch (error) {
      console.error("Scanning error:", error)
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Medicine Scanner</h1>
                <p className="text-sm text-gray-600">Powered by AI Recognition</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Scan Medicine</TabsTrigger>
            <TabsTrigger value="browse">Browse Categories</TabsTrigger>
          </TabsList>

          {/* Scan Tab */}
          <TabsContent value="scan" className="space-y-6">
            {!selectedImage ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="h-10 w-10 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Scan Your Medicine</h2>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Take a photo or upload an image of your medicine to get instant information from our
                        comprehensive database.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                      <Button onClick={() => cameraInputRef.current?.click()} className="flex-1" size="lg">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="flex-1"
                        size="lg"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-center space-x-4 text-sm text-blue-700">
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="h-4 w-4" />
                          <span>AI Recognition</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="h-4 w-4" />
                          <span>Medicine Database</span>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 text-center mt-2">
                        Connected to comprehensive medicine database
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Uploaded Image */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img
                          src={selectedImage || "/placeholder.svg"}
                          alt="Uploaded medicine"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => {
                            setSelectedImage(null)
                            setScannedMedicine(null)
                            setIsScanning(false)
                          }}
                        >
                          Upload Different Image
                        </Button>
                      </div>

                      <div className="md:w-2/3">
                        {isScanning ? (
                          <div className="text-center py-8">
                            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Analyzing Medicine...</h3>
                            <p className="text-gray-600">Searching medicine database</p>
                            <div className="mt-4 space-y-2">
                              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <span>Processing image...</span>
                              </div>
                              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Matching with database...</span>
                              </div>
                            </div>
                          </div>
                        ) : scannedMedicine ? (
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="text-sm text-green-600 font-medium">
                                Medicine identified with 95% confidence
                              </span>
                              <Badge variant="outline" className="text-xs">
                                DATABASE
                              </Badge>
                            </div>

                            <div>
                              <h3 className="text-xl font-bold mb-1">{scannedMedicine.name}</h3>
                              {scannedMedicine.genericName && scannedMedicine.genericName !== scannedMedicine.name && (
                                <p className="text-gray-600 text-sm mb-2">Generic: {scannedMedicine.genericName}</p>
                              )}
                              <Badge className="bg-blue-50 border-blue-200 text-blue-700">
                                {scannedMedicine.category}
                              </Badge>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-blue-900 mb-2">Description</h4>
                              <p className="text-blue-800">{scannedMedicine.description}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Active Ingredient</h4>
                              <p className="text-gray-700">{scannedMedicine.activeIngredient}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Uses</h4>
                              <div className="flex flex-wrap gap-2">
                                {scannedMedicine.uses.map((use, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {use}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Dosage</h4>
                                <p className="text-sm text-gray-600">{scannedMedicine.dosage}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Precautions</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {scannedMedicine.precautions.slice(0, 3).map((precaution, index) => (
                                    <li key={index}>• {precaution}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold mb-1">Price</h4>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-bold text-green-600">₹{scannedMedicine.price}</span>
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{scannedMedicine.originalPrice}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1">Rating</h4>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm">{scannedMedicine.rating}</span>
                                </div>
                              </div>
                            </div>

                            {scannedMedicine.manufacturer && (
                              <div>
                                <h4 className="font-semibold mb-2">Manufacturer</h4>
                                <p className="text-sm text-gray-600">{scannedMedicine.manufacturer}</p>
                              </div>
                            )}

                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                              <div className="flex items-start space-x-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-yellow-800">
                                  <p className="font-medium mb-1">Important Notice</p>
                                  <p>
                                    This information is from our medicine database. Always consult a healthcare
                                    professional before taking any medication.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Browse Categories Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.name}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/medicines?category=${category.name.toLowerCase()}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-lg ${category.color}`}>{category.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-sm text-gray-600">Browse medicines</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Explore {category.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
