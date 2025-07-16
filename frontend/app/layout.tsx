import type React from "react"
import type { Metadata } from "next"
// import { Inter } from "next/font/google"
import "./globals.css"
// import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"

// const inter = Inter({ subsets: ["latin"] })
// Using system fonts as fallback to avoid Google Fonts connection issues
const fontClass = "font-sans"

export const metadata: Metadata = {
  title: "Avaxen - Your Trusted Online Pharmacy",
  description:
    "Get genuine medicines delivered to your doorstep. Fast, reliable, and affordable healthcare solutions from Avaxen - your trusted online pharmacy.",
  keywords: "online pharmacy, medicines, healthcare, prescription drugs, health products, medical supplies",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fontClass}>
        {/* <AuthProvider> */}
          {children}
          <Toaster />
        {/* </AuthProvider> */}
      </body>
    </html>
  )
}
