'use client'

import Link from 'next/link'
import { ArrowLeft, MessageCircle, Bot, Sparkles } from 'lucide-react'

export default function HealthChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">AI Health Chat</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Coming Soon Icon */}
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-lg">
            <div className="relative">
              <MessageCircle className="h-16 w-16 text-white" />
              <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          {/* Coming Soon Text */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Health Chat
          </h1>
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-lg font-semibold mb-6 shadow-lg">
            <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
            Coming Soon
          </div>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            We're developing an advanced AI-powered health consultation chat that will provide 
            personalized wellness advice, medication guidance, and health tips.
          </p>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-600">Intelligent health advice powered by advanced AI technology</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock health consultation and guidance</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized</h3>
              <p className="text-gray-600">Tailored advice based on your health profile and needs</p>
            </div>
          </div>

          {/* What to Expect */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What to Expect</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Instant responses to your health-related questions</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Medication information and interaction warnings</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Wellness tips and preventive care advice</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Integration with your prescription and order history</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <p className="text-gray-600 mb-6">
              In the meantime, explore our other features:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/medicines"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse Medicines
              </Link>
              <Link
                href="/medicine-scanner"
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Try AI Scanner
              </Link>
              <Link
                href="/upload-prescription"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Upload Prescription
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            🚀 This feature is currently under development. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  )
}
