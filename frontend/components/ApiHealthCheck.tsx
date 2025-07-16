"use client"

import { useState, useEffect } from 'react'
import { checkApiHealth } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'

export function ApiHealthCheck() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const healthy = await checkApiHealth()
      setIsHealthy(healthy)
    } catch (error) {
      setIsHealthy(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isHealthy === null ? (
              <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
            ) : isHealthy ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm font-medium">Backend API</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={isHealthy ? "default" : "destructive"}>
              {isHealthy === null ? "Checking..." : isHealthy ? "Connected" : "Disconnected"}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={checkHealth}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        
        {isHealthy === false && (
          <p className="text-xs text-red-600 mt-2">
            Make sure the backend server is running on http://localhost:5000
          </p>
        )}
      </CardContent>
    </Card>
  )
}
