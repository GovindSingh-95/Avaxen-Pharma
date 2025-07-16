"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  fallbackUrl?: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function BackButton({ fallbackUrl = "/", className = "", variant = "ghost", size = "sm" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to home page if no history
      router.push(fallbackUrl)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleBack} className={className}>
      <ArrowLeft className="h-4 w-4" />
    </Button>
  )
}
