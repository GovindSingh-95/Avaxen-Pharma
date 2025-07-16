"use client"

import { useState, useEffect } from 'react'

interface MedicineImageProps {
  src?: string
  alt: string
  category?: string
  form?: string
  className?: string
  fallbackType?: 'placeholder' | 'category' | 'form'
}

// Reliable fallback images (these won't break)
const FALLBACK_IMAGES = {
  categories: {
    'Pain Relief': '/placeholder.svg',
    'Antibiotics': '/placeholder.svg', 
    'Supplements': '/placeholder.svg',
    'Digestive Health': '/placeholder.svg',
    'Allergy': '/placeholder.svg',
    'default': '/placeholder.svg'
  } as Record<string, string>,
  forms: {
    'Tablet': '/placeholder.svg',
    'Capsule': '/placeholder.svg', 
    'Syrup': '/placeholder.svg',
    'Cream': '/placeholder.svg',
    'default': '/placeholder.svg'
  } as Record<string, string>
}

// Ultimate fallback - data URL that will never fail
const DATA_URL_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE3Mi4zODYgMTAwIDE1MCAyMjIuMzg2IDE1MCAyNTBDMTUwIDI3Ny42MTQgMTcyLjM4NiAzMDAgMjAwIDMwMEMyMjcuNjE0IDMwMCAyNTAgMjc3LjYxNCAyNTAgMjUwQzI1MCAyMjIuMzg2IDIyNy42MTQgMjAwIDIwMCAyMDBaIiBmaWxsPSIjOUI5Qjk5Ii8+CjxwYXRoIGQ9Ik0yMDAgMTYwQzE4My40MzEgMTYwIDE3MCAyMTMuNDMxIDE3MCAyMzBDMTcwIDI0Ni41NjkgMTgzLjQzMSAyNjAgMjAwIDI2MEMyMTYuNTY5IDI2MCAyMzAgMjQ2LjU2OSAyMzAgMjMwQzIzMCAyMTMuNDMxIDIxNi41NjkgMjAwIDIwMCAyMDBaIiBmaWxsPSIjNkI3Mjg1Ii8+Cjwvdmc+'

export default function MedicineImage({ 
  src, 
  alt, 
  category = '', 
  form = '', 
  className = 'w-full h-full object-cover',
  fallbackType = 'placeholder'
}: MedicineImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || '/placeholder.svg')
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(!!src)

  // Reset when src changes
  useEffect(() => {
    if (src) {
      setCurrentSrc(src)
      setHasError(false)
      setIsLoading(true)
    } else {
      setCurrentSrc('/placeholder.svg')
      setHasError(false)
      setIsLoading(false)
    }
  }, [src])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setIsLoading(false)
      
      // Try fallback based on type
      let fallbackSrc = '/placeholder.svg'
      
      try {
        if (fallbackType === 'category' && category) {
          fallbackSrc = FALLBACK_IMAGES.categories[category] || FALLBACK_IMAGES.categories.default
        } else if (fallbackType === 'form' && form) {
          fallbackSrc = FALLBACK_IMAGES.forms[form] || FALLBACK_IMAGES.forms.default
        }
      } catch (error) {
        // If even the fallback fails, use data URL
        fallbackSrc = DATA_URL_FALLBACK
      }
      
      setCurrentSrc(fallbackSrc)
    } else {
      // If even the fallback failed, use ultimate fallback
      setCurrentSrc(DATA_URL_FALLBACK)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative">
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      
      {/* Main image */}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
      
      {/* Error indicator */}
      {hasError && (
        <div className="absolute top-2 right-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            Stock Photo
          </span>
        </div>
      )}
    </div>
  )
}

// Hook for medicine image optimization
export function useMedicineImage(medicine: any) {
  const [optimizedImage, setOptimizedImage] = useState('')

  useEffect(() => {
    if (medicine?.image) {
      // Check if it's a Cloudinary URL and add transformations
      if (medicine.image.includes('cloudinary.com')) {
        const transformedUrl = medicine.image.replace(
          '/upload/',
          '/upload/w_400,h_400,c_fill,g_center,q_auto:best,f_webp/'
        )
        setOptimizedImage(transformedUrl)
      } else {
        setOptimizedImage(medicine.image)
      }
    }
  }, [medicine])

  return optimizedImage || medicine?.image
}

// Utility for getting category-appropriate stock images
export const MEDICINE_STOCK_IMAGES = {
  categories: {
    'Pain Relief': [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400',
    ],
    'Antibiotics': [
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    ],
    'Supplements': [
      'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400',
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400',
    ],
    'Digestive Health': [
      'https://images.unsplash.com/photo-1583244685026-d8519b5e7be7?w=400',
    ],
    'Allergy': [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    ]
  },
  forms: {
    'Tablet': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    'Capsule': 'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400',
    'Syrup': 'https://images.unsplash.com/photo-1583244685026-d8519b5e7be7?w=400',
    'Cream': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
  }
}
