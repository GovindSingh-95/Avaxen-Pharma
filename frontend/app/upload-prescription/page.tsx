"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Camera, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { prescriptionApi } from "@/lib/api"

export default function UploadPrescriptionPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const router = useRouter()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (uploadedFiles.length === 0) {
      alert('Please select at least one prescription image')
      return
    }
    
    setIsUploading(true)

    try {
      const response = await prescriptionApi.uploadPrescription(uploadedFiles)
      if (response.success) {
        setIsUploading(false)
        setUploadSuccess(true)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Failed to upload prescription:', error)
      alert('Failed to upload prescription. Please try again.')
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Prescription Uploaded Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Our pharmacist will review your prescription and contact you within 2 hours.
            </p>
            <div className="space-y-3">
              <Button className="w-full">Track Your Order</Button>
              <Button variant="outline" className="w-full" onClick={() => setUploadSuccess(false)}>
                Upload Another Prescription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Prescription</h1>
            <p className="text-lg text-gray-600">
              Upload a clear photo of your prescription and get your medicines delivered
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle>Prescription Details</CardTitle>
              <CardDescription>Please provide your prescription and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div>
                  <Label htmlFor="prescription">Upload Prescription Images</Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Drag and drop your prescription images here, or click to browse
                      </p>
                      <Input
                        id="prescription"
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("prescription")?.click()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div>
                    <Label>Uploaded Files</Label>
                    <div className="mt-2 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Patient Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required />
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea id="address" rows={3} required />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea id="notes" rows={2} placeholder="Any specific instructions or requirements..." />
                </div>

                <Button type="submit" className="w-full" disabled={uploadedFiles.length === 0 || isUploading}>
                  {isUploading ? "Uploading..." : "Submit Prescription"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                  Upload Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Photo Quality</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Ensure the prescription is clearly visible</li>
                    <li>• Use good lighting when taking the photo</li>
                    <li>• Avoid shadows and reflections</li>
                    <li>• Include all pages if multiple</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Accepted Formats</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• JPEG, PNG, PDF files</li>
                    <li>• Maximum file size: 10MB</li>
                    <li>• Multiple files allowed</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Processing Time</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Verification within 2 hours</li>
                    <li>• SMS/Email confirmation sent</li>
                    <li>• Same day delivery available</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
