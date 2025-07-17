"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ShoppingCart,
  Upload,
  Truck,
  Shield,
  Clock,
  Star,
  Heart,
  Pill,
  Stethoscope,
  ArrowRight,
  Camera,
  Scan,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { medicineApi, type Medicine } from "@/lib/api"
import MedicineImage from "@/components/ui/medicine-image"
import { useAuth } from "@/contexts/AuthContext"
// import { ApiHealthCheck } from "@/components/ApiHealthCheck"

// Desktop Actions Component
function DesktopActions() {
  const { user, logout } = useAuth()

  if (user) {
    return (
      <div className="hidden md:flex items-center space-x-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile">
            <Heart className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cart">
            <ShoppingCart className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{user.name}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center space-x-3">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/cart">
          <ShoppingCart className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/register">Sign Up</Link>
      </Button>
    </div>
  )
}

// Mobile Actions Component
function MobileActions() {
  const { user, logout } = useAuth()

  if (user) {
    return (
      <div className="flex flex-col space-y-2 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4" />
              <span className="ml-2">Cart</span>
            </Link>
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="flex items-center justify-start space-x-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-2 pt-3 border-t border-gray-100">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cart">
            <ShoppingCart className="h-4 w-4" />
            <span className="ml-2">Cart</span>
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
      <Button size="sm" asChild>
        <Link href="/register">Sign Up</Link>
      </Button>
    </div>
  )
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [featuredMedicines, setFeaturedMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch featured medicines from API
  useEffect(() => {
    const fetchFeaturedMedicines = async () => {
      try {
        const response = await medicineApi.getFeaturedMedicines(4)
        setFeaturedMedicines(response.medicines)
      } catch (error) {
        console.error('Failed to fetch featured medicines:', error)
        // Fallback to empty array or show error message
        setFeaturedMedicines([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMedicines()
  }, [])

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/medicines?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const categories = [
    { name: "Pain Relief", icon: "💊", color: "bg-blue-50 hover:bg-blue-100", link: "/medicines?category=pain-relief" },
    { name: "Cold & Flu", icon: "🤧", color: "bg-green-50 hover:bg-green-100", link: "/medicines?category=cold-flu" },
    { name: "Vitamins", icon: "💪", color: "bg-orange-50 hover:bg-orange-100", link: "/medicines?category=vitamins" },
    { name: "Skin Care", icon: "✨", color: "bg-purple-50 hover:bg-purple-100", link: "/medicines?category=skin-care" },
    { name: "Baby Care", icon: "👶", color: "bg-pink-50 hover:bg-pink-100", link: "/medicines?category=baby-care" },
    { name: "Diabetes", icon: "🩺", color: "bg-red-50 hover:bg-red-100", link: "/medicines?category=diabetes" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* API Health Check - Temporarily removed */}
      {/* <div className="fixed top-4 right-4 z-50">
        <ApiHealthCheck />
      </div> */}

      {/* Fixed Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/avaxan-logo.png" 
                alt="Avaxan Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900">Avaxan</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/medicines" className="text-gray-600 hover:text-blue-600 transition-colors">
                Medicines
              </Link>
              <Link href="/medicine-scanner" className="text-gray-600 hover:text-blue-600 transition-colors">
                Medicine Scanner
              </Link>
              <Link href="/health-chat" className="text-gray-600 hover:text-blue-600 transition-colors">
                Health Chat
              </Link>
              <Link href="/upload-prescription" className="text-gray-600 hover:text-blue-600 transition-colors">
                Upload Prescription
              </Link>
            </nav>

            {/* Desktop Actions */}
            <DesktopActions />

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-3 mt-4">
                <Link href="/medicines" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Medicines
                </Link>
                <Link href="/medicine-scanner" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Medicine Scanner
                </Link>
                <Link href="/health-chat" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Health Chat
                </Link>
                <Link href="/upload-prescription" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Upload Prescription
                </Link>
                <MobileActions />
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your Health, Delivered</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Order genuine medicines online with free delivery. Trusted by thousands of families across India.
          </p>

          {/* Working Search */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 pr-4 py-3 text-base rounded-full border-2 border-gray-200 focus:border-blue-500"
              />
              <Button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                size="sm"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-3xl mx-auto">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/upload-prescription">
                <Upload className="h-4 w-4 mr-2" />
                Upload Prescription
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/medicine-scanner">
                <Camera className="h-4 w-4 mr-2" />
                Scan Medicine
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/health-chat">
                <Stethoscope className="h-4 w-4 mr-2" />
                Health Chat
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Medicine Scanner Feature */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                  <Scan className="h-12 w-12 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2">AI-Powered Medicine Scanner</h2>
                  <p className="text-gray-600 mb-4">
                    Simply take a photo of any medicine to instantly get detailed information about its uses, effects,
                    and precautions.
                  </p>
                  <Button asChild>
                    <Link href="/medicine-scanner">
                      Try Medicine Scanner
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-600 text-sm">On orders above ₹500</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">100% Genuine</h3>
              <p className="text-gray-600 text-sm">CDSCO approved medicines</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Quick Delivery</h3>
              <p className="text-gray-600 text-sm">Same day in metro cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Link key={index} href={category.link}>
                <div
                  className={`${category.color} p-6 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-medium text-gray-800">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Popular Medicines</h2>
            <p className="text-gray-600">Most trusted by our customers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="border-0 bg-white">
                  <CardContent className="p-4">
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded mb-3 animate-pulse w-3/4" />
                    <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse w-1/2" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))
            ) : featuredMedicines && featuredMedicines.length > 0 ? (
              featuredMedicines.map((medicine) => (
                <Card key={medicine._id} className="hover:shadow-lg transition-shadow border-0 bg-white">
                  <CardContent className="p-4">
                    <MedicineImage
                      src={medicine.image}
                      alt={medicine.name}
                      category={medicine.category}
                      form={medicine.form}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      fallbackType="category"
                    />

                    <h3 className="font-medium mb-2">{medicine.name}</h3>

                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{medicine.rating}</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-green-600">₹{medicine.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">₹{medicine.originalPrice}</span>
                      </div>
                      {medicine.prescription && <Badge className="bg-red-500 text-xs">Rx</Badge>}
                    </div>

                    <Button className="w-full" size="sm" onClick={() => router.push(`/medicines/${medicine._id}`)}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              // No medicines found
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No featured medicines available at the moment.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/medicines')}>
                  Browse All Medicines
                </Button>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/medicines">
                View All Medicines
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Health Assistant CTA */}
      <section className="py-16 bg-blue-600 text-white px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Need Health Advice?</h2>
          <p className="text-lg mb-8 opacity-90">Chat with our AI health assistant for wellness tips and guidance</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/health-chat">
              Start Health Chat
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <img 
                  src="/avaxan-logo.png" 
                  alt="Avaxan Logo" 
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold">Avaxan</span>
              </Link>
              <p className="text-gray-400">Your trusted online pharmacy for genuine medicines and healthcare.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/medicines" className="hover:text-white transition-colors">
                    Medicines
                  </Link>
                </li>
                <li>
                  <Link href="/medicine-scanner" className="hover:text-white transition-colors">
                    Medicine Scanner
                  </Link>
                </li>
                <li>
                  <Link href="/health-chat" className="hover:text-white transition-colors">
                    Health Chat
                  </Link>
                </li>
                <li>
                  <Link href="/upload-prescription" className="hover:text-white transition-colors">
                    Upload Prescription
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📞 1800-123-4567</li>
                <li>📧 support@avaxan.com</li>
                <li>🕒 24/7 Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Avaxan. Licensed Online Pharmacy.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
