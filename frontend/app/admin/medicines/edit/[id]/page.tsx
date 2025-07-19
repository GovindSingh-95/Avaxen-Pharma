"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Upload, Save, ArrowLeft, Package, AlertCircle, Trash2 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { adminApi, medicineApi, type Medicine } from "@/lib/api"

export default function EditMedicinePage() {
  const router = useRouter()
  const params = useParams()
  const medicineId = params.id as string
  
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    category: '',
    manufacturer: '',
    form: '',
    strength: '',
    description: '',
    price: '',
    mrp: '',
    discount: '',
    quantity: '',
    minQuantity: '',
    requiresPrescription: false,
    isActive: true,
    tags: '',
    sideEffects: '',
    dosage: '',
    storage: '',
    expiryDate: '',
    batchNumber: '',
    hsnCode: '',
    gstRate: ''
  })

  useEffect(() => {
    if (medicineId) {
      loadMedicine()
    }
  }, [medicineId])

  const loadMedicine = async () => {
    try {
      setLoading(true)
      const response = await medicineApi.getMedicineById(medicineId)
      if (response.success) {
        const med = response.medicine
        setMedicine(med)
        setFormData({
          name: med.name || '',
          genericName: med.genericName || '',
          category: med.category || '',
          manufacturer: med.manufacturer || '',
          form: med.form || '',
          strength: med.strength || '',
          description: med.description || '',
          price: med.price?.toString() || '',
          mrp: med.mrp?.toString() || '',
          discount: med.discount?.toString() || '',
          quantity: med.quantity?.toString() || '',
          minQuantity: med.minQuantity?.toString() || '',
          requiresPrescription: med.requiresPrescription || false,
          isActive: med.isActive !== false,
          tags: med.tags?.join(', ') || '',
          sideEffects: med.sideEffects || '',
          dosage: med.dosage || '',
          storage: med.storage || '',
          expiryDate: med.expiryDate || '',
          batchNumber: med.batchNumber || '',
          hsnCode: med.hsnCode || '',
          gstRate: med.gstRate?.toString() || ''
        })
        if (med.image) {
          setImagePreview(med.image)
        }
      }
    } catch (error) {
      console.error('Failed to load medicine:', error)
      alert('Failed to load medicine details')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create FormData for image upload
      const submitData = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '') {
          submitData.append(key, String(value))
        }
      })

      // Add image if selected
      if (imageFile) {
        submitData.append('image', imageFile)
      }

      const response = await adminApi.medicines.update(medicineId, submitData)
      
      if (response.success) {
        alert('Medicine updated successfully!')
        router.push('/admin/medicines/inventory')
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Failed to update medicine:', error)
      alert('Failed to update medicine. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this medicine? This action cannot be undone.')) {
      return
    }

    try {
      const response = await adminApi.medicines.delete(medicineId)
      if (response.success) {
        alert('Medicine deleted successfully!')
        router.push('/admin/medicines/inventory')
      }
    } catch (error) {
      console.error('Failed to delete medicine:', error)
      alert('Failed to delete medicine. Please try again.')
    }
  }

  const categories = [
    'Pain Relief', 'Antibiotics', 'Supplements', 'Diabetes', 'Cardiovascular',
    'Respiratory', 'Gastrointestinal', 'Dermatological', 'Ophthalmic', 'Dental',
    'Gynecological', 'Pediatric', 'Geriatric', 'Emergency', 'Surgical'
  ]

  const forms = [
    'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Gel',
    'Drops', 'Inhaler', 'Powder', 'Suspension', 'Lotion', 'Spray'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medicine details...</p>
        </div>
      </div>
    )
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Medicine Not Found</h2>
          <p className="text-gray-600 mb-4">The medicine you're looking for doesn't exist.</p>
          <Link href="/admin/medicines/inventory">
            <Button>Back to Inventory</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin/medicines/inventory">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Inventory
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Medicine</h1>
              <p className="text-gray-600">Update medicine details and inventory</p>
            </div>
          </div>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Medicine
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
              <CardDescription>Essential medicine details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Medicine Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Paracetamol 500mg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="genericName">Generic Name</Label>
                  <Input
                    id="genericName"
                    value={formData.genericName}
                    onChange={(e) => handleInputChange('genericName', e.target.value)}
                    placeholder="e.g., Acetaminophen"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="form">Form *</Label>
                  <Select value={formData.form} onValueChange={(value) => handleInputChange('form', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                      {forms.map(form => (
                        <SelectItem key={form} value={form}>{form}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="strength">Strength</Label>
                  <Input
                    id="strength"
                    value={formData.strength}
                    onChange={(e) => handleInputChange('strength', e.target.value)}
                    placeholder="e.g., 500mg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  placeholder="e.g., Cipla Ltd"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the medicine"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>Set pricing and manage stock levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mrp">MRP (₹) *</Label>
                  <Input
                    id="mrp"
                    type="number"
                    step="0.01"
                    value={formData.mrp}
                    onChange={(e) => handleInputChange('mrp', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Selling Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => handleInputChange('discount', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Current Stock *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minQuantity">Minimum Stock Level</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) => handleInputChange('minQuantity', e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="requiresPrescription"
                  checked={formData.requiresPrescription}
                  onCheckedChange={(checked) => handleInputChange('requiresPrescription', checked)}
                />
                <Label htmlFor="requiresPrescription">Requires Prescription</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active (Available for sale)</Label>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Medicine Image</CardTitle>
              <CardDescription>Update the medicine image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image">Upload New Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                {imagePreview && (
                  <div className="w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Optional details for better management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    value={formData.batchNumber}
                    onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                    placeholder="e.g., BATCH001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hsnCode">HSN Code</Label>
                  <Input
                    id="hsnCode"
                    value={formData.hsnCode}
                    onChange={(e) => handleInputChange('hsnCode', e.target.value)}
                    placeholder="e.g., 3004"
                  />
                </div>
                <div>
                  <Label htmlFor="gstRate">GST Rate (%)</Label>
                  <Input
                    id="gstRate"
                    type="number"
                    step="0.01"
                    value={formData.gstRate}
                    onChange={(e) => handleInputChange('gstRate', e.target.value)}
                    placeholder="18.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="fever, pain, headache (comma separated)"
                />
              </div>

              <div>
                <Label htmlFor="sideEffects">Side Effects</Label>
                <Textarea
                  id="sideEffects"
                  value={formData.sideEffects}
                  onChange={(e) => handleInputChange('sideEffects', e.target.value)}
                  placeholder="Common side effects..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="dosage">Dosage Instructions</Label>
                <Textarea
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => handleInputChange('dosage', e.target.value)}
                  placeholder="Recommended dosage..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="storage">Storage Instructions</Label>
                <Textarea
                  id="storage"
                  value={formData.storage}
                  onChange={(e) => handleInputChange('storage', e.target.value)}
                  placeholder="Store in a cool, dry place..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/medicines/inventory">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Updating Medicine...' : 'Update Medicine'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 