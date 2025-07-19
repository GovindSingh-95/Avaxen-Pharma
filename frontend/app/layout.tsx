import type React from "react"
import type { Metadata } from "next"
// import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"

// const inter = Inter({ subsets: ["latin"] })
// Using system fonts as fallback to avoid Google Fonts connection issues
const fontClass = "font-sans"

export const metadata: Metadata = {
  title: "Avaxan - Your wellbeing is our happiness",
  description:
    "Your wellbeing is our happiness. Get genuine medicines delivered to your doorstep. Fast, reliable, and affordable healthcare solutions from Avaxan.",
  keywords: "online pharmacy, medicines, healthcare, prescription drugs, health products, medical supplies",
  generator: 'v0.dev',
  icons: {
    icon: '/avaxan-logo.ico',
    shortcut: '/avaxan-logo.ico',
    apple: '/avaxan-logo.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fontClass}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
