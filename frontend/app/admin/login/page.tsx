"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield, Users, Package, Headphones, TrendingUp } from "lucide-react"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  
  const { login, user } = useAuth()
  const router = useRouter()

  // Handle redirect after successful login and user context update
  useEffect(() => {
    if (loginSuccess && user) {
      if (['admin', 'pharmacist'].includes(user.role)) {
        router.push("/admin")
      } else {
        setError("Access denied. Admin privileges required.")
        setLoginSuccess(false)
        setLoading(false)
      }
    }
  }, [loginSuccess, user, router])

  const adminAccounts = [
    {
      role: "Owner/Manager",
      email: "admin@avaxen.com",
      password: "admin123",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      permissions: "Full System Access"
    },
    {
      role: "Head Pharmacist", 
      email: "pharmacist@avaxen.com",
      password: "pharma123",
      icon: <Users className="h-5 w-5" />,
      color: "bg-green-100 text-green-800 border-green-200",
      permissions: "Medicines, Prescriptions, Orders"
    },
    {
      role: "Demo Admin",
      email: "demo@avaxen.com", 
      password: "demo123",
      icon: <Package className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      permissions: "Demo Access - All Features"
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleQuickLogin = (email: string, password: string) => {
    setFormData({ email, password })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError("Please enter email and password")
      setLoading(false)
      return
    }

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Set login success flag to trigger useEffect for redirect
        setLoginSuccess(true)
      } else {
        setError(result.message || "Login failed")
        setLoading(false)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/axaxan-logo.svg" 
                alt="Avaxan Logo" 
                className="h-8 w-8"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Avaxan Admin Portal</h1>
                <p className="text-sm text-gray-600">Pharmacy Management System</p>
              </div>
            </div>
            <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Website
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Login Form */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
                <CardDescription>
                  Access your department dashboard
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your work email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In to Dashboard"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Need help accessing your account?{" "}
                    <span className="font-medium text-blue-600 cursor-pointer">
                      Contact IT Support
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Department Accounts */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Department Access</h2>
                <p className="text-gray-600">Choose your department login below</p>
              </div>

              <div className="space-y-4">
                {adminAccounts.map((account, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleQuickLogin(account.email, account.password)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${account.color}`}>
                            {account.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{account.role}</h3>
                            <p className="text-sm text-gray-600">{account.permissions}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            Click to Login
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🔐 Security Note</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Each department has specific access permissions</li>
                  <li>• All admin actions are logged for security</li>
                  <li>• Change default passwords on first login</li>
                  <li>• Log out when finished to secure your session</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
