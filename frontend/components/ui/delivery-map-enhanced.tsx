"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "./badge";
import { Button } from "./button";
import { Phone, Navigation, Clock, MapPin, Smartphone } from "lucide-react";

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface DeliveryMapProps {
  pharmacyLocation: { lat: number; lng: number; name?: string };
  deliveryLocation: { lat: number; lng: number; address?: string };
  currentLocation?: { lat: number; lng: number };
  deliveryStatus: string;
  deliveryAgent?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  estimatedTime?: string;
  onCallAgent?: () => void;
}

export function DeliveryMap({ 
  pharmacyLocation, 
  deliveryLocation, 
  currentLocation, 
  deliveryStatus,
  deliveryAgent,
  estimatedTime = "15-20 min",
  onCallAgent
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const deliveryMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate live location updates (replace with real WebSocket/API calls)
  useEffect(() => {
    if (!isLiveTracking || !currentLocation) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In real implementation, this would fetch from your backend API
      simulateLocationUpdate();
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [isLiveTracking, currentLocation]);

  const simulateLocationUpdate = () => {
    if (!mapInstance.current || !currentLocation || !deliveryMarkerRef.current) return;

    // Simulate small movement towards destination (in real app, get from GPS)
    const deltaLat = (deliveryLocation.lat - currentLocation.lat) * 0.05;
    const deltaLng = (deliveryLocation.lng - currentLocation.lng) * 0.05;
    
    const newLat = currentLocation.lat + deltaLat + (Math.random() - 0.5) * 0.0005;
    const newLng = currentLocation.lng + deltaLng + (Math.random() - 0.5) * 0.0005;
    
    // Update delivery marker with smooth animation
    deliveryMarkerRef.current.setLatLng([newLat, newLng]);
    
    // Update currentLocation for next iteration
    currentLocation.lat = newLat;
    currentLocation.lng = newLng;
  };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map with better view
    const centerLat = currentLocation ? 
      (pharmacyLocation.lat + deliveryLocation.lat + currentLocation.lat) / 3 :
      (pharmacyLocation.lat + deliveryLocation.lat) / 2;
    
    const centerLng = currentLocation ? 
      (pharmacyLocation.lng + deliveryLocation.lng + currentLocation.lng) / 3 :
      (pharmacyLocation.lng + deliveryLocation.lng) / 2;

    const map = L.map(mapRef.current).setView([centerLat, centerLng], 13);
    mapInstance.current = map;

    // Add tile layer with better styling
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Custom icons with Zomato-style design
    const pharmacyIcon = L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #10b981, #059669); 
          color: white; 
          border-radius: 50%; 
          width: 45px; 
          height: 45px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 20px;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          border: 4px solid white;
          position: relative;
        ">
          🏥
          <div style="
            position: absolute;
            top: -5px;
            right: -5px;
            background: #059669;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            border: 2px solid white;
          "></div>
        </div>`,
      iconSize: [45, 45],
      className: 'custom-pharmacy-icon'
    });

    const deliveryIcon = L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #3b82f6, #2563eb); 
          color: white; 
          border-radius: 50%; 
          width: 45px; 
          height: 45px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 20px;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
          border: 4px solid white;
          animation: pulse 2s infinite;
          position: relative;
        ">
          🚚
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            background: #22c55e;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            border: 3px solid white;
            animation: blink 1s infinite;
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5); }
            50% { transform: scale(1.05); box-shadow: 0 8px 25px rgba(59, 130, 246, 0.7); }
            100% { transform: scale(1); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5); }
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
        </style>`,
      iconSize: [45, 45],
      className: 'custom-delivery-icon'
    });

    const destinationIcon = L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #ef4444, #dc2626); 
          color: white; 
          border-radius: 50%; 
          width: 45px; 
          height: 45px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 20px;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
          border: 4px solid white;
        ">🏠</div>`,
      iconSize: [45, 45],
      className: 'custom-destination-icon'
    });

    // Add markers with enhanced popups
    const pharmacyMarker = L.marker([pharmacyLocation.lat, pharmacyLocation.lng], { icon: pharmacyIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; font-family: system-ui; padding: 8px;">
          <div style="font-size: 16px; font-weight: bold; color: #10b981; margin-bottom: 4px;">
            🏥 ${pharmacyLocation.name || 'Pharmacy'}
          </div>
          <div style="color: #6b7280; font-size: 14px;">Pickup Location</div>
          <div style="margin-top: 8px; padding: 4px 8px; background: #f0fdf4; border-radius: 12px; color: #166534; font-size: 12px;">
            ✅ Order Ready
          </div>
        </div>
      `);

    const destinationMarker = L.marker([deliveryLocation.lat, deliveryLocation.lng], { icon: destinationIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; font-family: system-ui; padding: 8px;">
          <div style="font-size: 16px; font-weight: bold; color: #ef4444; margin-bottom: 4px;">
            🏠 Your Location
          </div>
          <div style="color: #6b7280; font-size: 12px; line-height: 1.4;">
            ${deliveryLocation.address || 'Delivery Address'}
          </div>
          <div style="margin-top: 8px; padding: 4px 8px; background: #fef2f2; border-radius: 12px; color: #991b1b; font-size: 12px;">
            📦 Destination
          </div>
        </div>
      `);

    // Add delivery agent marker if current location exists
    if (currentLocation) {
      const deliveryMarker = L.marker([currentLocation.lat, currentLocation.lng], { icon: deliveryIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; font-family: system-ui; padding: 8px;">
            <div style="font-size: 16px; font-weight: bold; color: #3b82f6; margin-bottom: 4px;">
              🚚 ${deliveryAgent?.name || 'Delivery Agent'}
            </div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 6px;">
              ${deliveryAgent?.vehicle || 'On the way to you'}
            </div>
            <div style="margin: 6px 0; padding: 4px 8px; background: #eff6ff; border-radius: 12px; color: #1d4ed8; font-size: 12px;">
              🔴 Live Tracking
            </div>
            <div style="color: #6b7280; font-size: 10px;">
              ETA: ${estimatedTime}
            </div>
          </div>
        `);
      
      deliveryMarkerRef.current = deliveryMarker;

      // Draw animated route line
      const routePoints = [
        [pharmacyLocation.lat, pharmacyLocation.lng],
        [currentLocation.lat, currentLocation.lng],
        [deliveryLocation.lat, deliveryLocation.lng]
      ] as L.LatLngExpression[];

      const routeLine = L.polyline(routePoints, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
        className: 'animated-route'
      }).addTo(map);
      
      routeLayerRef.current = routeLine;

      // Add CSS for route animation
      const style = document.createElement('style');
      style.textContent = `
        .animated-route {
          animation: dash 2s linear infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Fit map to show all markers with padding
    const group = new L.FeatureGroup([
      pharmacyMarker,
      destinationMarker,
      ...(deliveryMarkerRef.current ? [deliveryMarkerRef.current] : [])
    ]);
    map.fitBounds(group.getBounds().pad(0.15));

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [pharmacyLocation, deliveryLocation, currentLocation]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'out for delivery': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'picked up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      {/* Live Tracking Header */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Tracking Active</span>
            </div>
            <Badge className={getStatusColor(deliveryStatus)}>
              {deliveryStatus}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">ETA: {estimatedTime}</div>
              <div className="text-xs text-gray-500">
                Updated {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
            
            {deliveryAgent && onCallAgent && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onCallAgent}
                className="flex items-center space-x-1"
              >
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </Button>
            )}
          </div>
        </div>
        
        {deliveryAgent && (
          <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Smartphone className="h-4 w-4" />
              <span>{deliveryAgent.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Navigation className="h-4 w-4" />
              <span>{deliveryAgent.vehicle}</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <div ref={mapRef} className="w-full h-96" />
        
        {/* Map Controls Overlay */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            size="sm"
            variant={isLiveTracking ? "default" : "outline"}
            onClick={() => setIsLiveTracking(!isLiveTracking)}
            className="bg-white/90 backdrop-blur-sm shadow-md"
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${isLiveTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLiveTracking ? 'Live' : 'Paused'}
          </Button>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs">🏥</div>
              <span>Pharmacy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs">🚚</div>
              <span>Delivery Agent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs">🏠</div>
              <span>Your Location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
