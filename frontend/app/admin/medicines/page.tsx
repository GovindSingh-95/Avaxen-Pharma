"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Image as ImageIcon, Trash2, Edit, Plus, Check, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { adminApi, medicineApi, type Medicine } from "@/lib/api"

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Load medicines on component mount
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setLoading(true)
        const response = await medicineApi.getMedicines({ limit: 100 })
        setMedicines(response.medicines)
      } catch (error) {
        console.error('Failed to load medicines:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMedicines()
  }, [])

  // Image upload with automatic optimization
  const handleImageUpload = async (medicineId: string, file: File) => {
    setIsUploading(true)
    
    try {
      const result = await adminApi.medicines.uploadImage(medicineId, file)
      
      if (result.success) {
        // Update medicine with new image URL
        setMedicines(prev => prev.map(med => 
          med._id === medicineId 
            ? { ...med, image: result.imageUrl }
            : med
        ))
        alert('Image uploaded successfully!')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setImageFile(null)
      setImagePreview('')
    }
  }

  // Bulk image management
  const uploadMedicineImages = async () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = true
    fileInput.accept = 'image/*'
    
    fileInput.onchange = async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      
      for (const file of files) {
        // Extract medicine name from filename
        const fileName = file.name.toLowerCase()
        const matchedMedicine = medicines.find(med => 
          fileName.includes(med.name.toLowerCase().replace(/\s+/g, '-'))
        )
        
        if (matchedMedicine) {
          await handleImageUpload(matchedMedicine._id, file)
        }
      }
    }
    
    fileInput.click()
  }

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medicines...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medicine Image Management</h1>
            <p className="text-gray-600">Upload and manage medicine images for the catalog</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={uploadMedicineImages} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload Images
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Medicine
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pain-relief">Pain Relief</SelectItem>
                  <SelectItem value="antibiotics">Antibiotics</SelectItem>
                  <SelectItem value="supplements">Supplements</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Medicine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedicines.map((medicine) => (
            <Card key={medicine._id} className="relative group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
                  {medicine.image ? (
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Upload overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary">
                          <Upload className="h-4 w-4 mr-2" />
                          {medicine.image ? 'Change' : 'Upload'} Image
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Image for {medicine.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Select Image</Label>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setImageFile(file)
                                  setImagePreview(URL.createObjectURL(file))
                                }
                              }}
                            />
                          </div>
                          
                          {imagePreview && (
                            <div className="aspect-square w-32 mx-auto">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={() => imageFile && handleImageUpload(medicine._id, imageFile)}
                              disabled={!imageFile || isUploading}
                              className="flex-1"
                            >
                              {isUploading ? 'Uploading...' : 'Upload Image'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">{medicine.name}</h3>
                  <p className="text-xs text-gray-600">{medicine.genericName}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {medicine.category}
                    </Badge>
                    <span className="text-sm font-medium">₹{medicine.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className={medicine.inStock ? 'text-green-600' : 'text-red-600'}>
                      {medicine.inStock ? `Stock: ${medicine.stockQuantity}` : 'Out of Stock'}
                    </span>
                    <span className="text-gray-500">{medicine.manufacturer}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMedicines.length === 0 && !loading && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding some medicines to the catalog.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
