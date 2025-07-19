"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Package, 
  Search, 
  Filter, 
  Edit, 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Download,
  Upload
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { adminApi, medicineApi, type Medicine } from "@/lib/api"

export default function InventoryManagementPage() {
  const router = useRouter()
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [updateQuantity, setUpdateQuantity] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    loadMedicines()
  }, [])

  const loadMedicines = async () => {
    try {
      setLoading(true)
      const response = await medicineApi.getMedicines({ limit: 1000 })
      setMedicines(response.medicines)
    } catch (error) {
      console.error('Failed to load medicines:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async () => {
    if (!selectedMedicine || !updateQuantity) return

    setIsUpdating(true)
    try {
      const response = await adminApi.medicines.updateQuantity(
        selectedMedicine._id,
        parseInt(updateQuantity)
      )
      
      if (response.success) {
        // Update local state
        setMedicines(prev => prev.map(med => 
          med._id === selectedMedicine._id 
            ? { ...med, quantity: parseInt(updateQuantity) }
            : med
        ))
        setSelectedMedicine(null)
        setUpdateQuantity('')
        alert('Quantity updated successfully!')
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
      alert('Failed to update quantity. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const getStockStatus = (quantity: number, minQuantity: number = 10) => {
    if (quantity === 0) return { status: 'out-of-stock', label: 'Out of Stock', color: 'destructive' }
    if (quantity <= minQuantity) return { status: 'low-stock', label: 'Low Stock', color: 'destructive' }
    if (quantity <= minQuantity * 2) return { status: 'medium-stock', label: 'Medium Stock', color: 'secondary' }
    return { status: 'in-stock', label: 'In Stock', color: 'default' }
  }

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter
    
    let matchesStock = true
    if (stockFilter === 'out-of-stock') matchesStock = medicine.quantity === 0
    else if (stockFilter === 'low-stock') matchesStock = medicine.quantity > 0 && medicine.quantity <= (medicine.minQuantity || 10)
    else if (stockFilter === 'in-stock') matchesStock = medicine.quantity > (medicine.minQuantity || 10)

    return matchesSearch && matchesCategory && matchesStock
  })

  const categories = Array.from(new Set(medicines.map(m => m.category))).sort()
  const lowStockCount = medicines.filter(m => m.quantity <= (m.minQuantity || 10)).length
  const outOfStockCount = medicines.filter(m => m.quantity === 0).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Manage medicine stock levels and quantities</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={loadMedicines}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/admin/medicines/add">
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{medicines.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {medicines.filter(m => m.quantity > (m.minQuantity || 10)).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Stock Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Medicine Inventory</CardTitle>
            <CardDescription>
              Showing {filteredMedicines.length} of {medicines.length} medicines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((medicine) => {
                  const stockStatus = getStockStatus(medicine.quantity, medicine.minQuantity)
                  return (
                    <TableRow key={medicine._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{medicine.name}</div>
                          <div className="text-sm text-gray-500">{medicine.genericName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{medicine.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{medicine.quantity}</div>
                      </TableCell>
                      <TableCell>{medicine.minQuantity || 10}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.color as any}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{medicine.price}</TableCell>
                                             <TableCell>
                         <div className="flex space-x-2">
                           <Link href={`/admin/medicines/edit/${medicine._id}`}>
                             <Button variant="outline" size="sm">
                               <Edit className="h-4 w-4 mr-2" />
                               Edit
                             </Button>
                           </Link>
                           <Dialog>
                             <DialogTrigger asChild>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => setSelectedMedicine(medicine)}
                               >
                                 <Package className="h-4 w-4 mr-2" />
                                 Stock
                               </Button>
                             </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Stock for {selectedMedicine?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Current Stock: {selectedMedicine?.quantity}</Label>
                              </div>
                              <div>
                                <Label htmlFor="newQuantity">New Quantity</Label>
                                <Input
                                  id="newQuantity"
                                  type="number"
                                  value={updateQuantity}
                                  onChange={(e) => setUpdateQuantity(e.target.value)}
                                  placeholder="Enter new quantity"
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedMedicine(null)
                                    setUpdateQuantity('')
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleUpdateQuantity}
                                  disabled={isUpdating || !updateQuantity}
                                >
                                  {isUpdating ? 'Updating...' : 'Update Stock'}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 