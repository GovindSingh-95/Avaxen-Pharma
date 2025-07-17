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
  const [orderProgress, setOrderProgress] = useState({
    orderPlaced: true,
    pharmacyConfirmed: true,
    medicinesPrepared: true,
    driverAssigned: currentLocation ? true : false,
    pickedUp: currentLocation ? true : false,
    onTheWay: currentLocation ? true : false,
    nearDestination: false,
    delivered: false
  });
  const [estimatedDistance, setEstimatedDistance] = useState(0);

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
    
    // Calculate distance to destination
    const distanceToDestination = Math.sqrt(
      Math.pow(deliveryLocation.lat - newLat, 2) + 
      Math.pow(deliveryLocation.lng - newLng, 2)
    ) * 111; // Rough km conversion
    
    setEstimatedDistance(distanceToDestination);
    
    // Update order progress based on distance
    setOrderProgress(prev => ({
      ...prev,
      nearDestination: distanceToDestination < 0.5, // Within 500m
      onTheWay: true
    }));
    
    // Update delivery marker with smooth animation
    deliveryMarkerRef.current.setLatLng([newLat, newLng]);
    
    // Add delivery completion detection
    if (distanceToDestination < 0.05) { // Very close (50m)
      setOrderProgress(prev => ({
        ...prev,
        delivered: true,
        nearDestination: true
      }));
      
      // Trigger delivery completion notification
      setTimeout(() => {
        alert('🎉 Order Delivered Successfully!\n\nYour medicines have been delivered. Thank you for choosing our pharmacy!');
      }, 1000);
    }
    
    // Update route line to show covered path with enhanced visualization
    if (routeLayerRef.current) {
      const coveredRoute = [
        [pharmacyLocation.lat, pharmacyLocation.lng],
        [newLat, newLng] // Current position
      ] as L.LatLngExpression[];
      
      const remainingRoute = [
        [newLat, newLng], // Current position
        [deliveryLocation.lat, deliveryLocation.lng]
      ] as L.LatLngExpression[];
      
      // Update route with different colors for completed vs remaining
      routeLayerRef.current.setLatLngs(coveredRoute);
      routeLayerRef.current.setStyle({ 
        color: orderProgress.nearDestination ? '#10b981' : '#22c55e', 
        weight: 6,
        opacity: 0.9,
        dashArray: orderProgress.nearDestination ? '' : '10, 5' // Solid line when near
      });
      
      // Add remaining route in lighter color
      if (!orderProgress.delivered) {
        const remainingLine = L.polyline(remainingRoute, {
          color: '#94a3b8',
          weight: 3,
          opacity: 0.5,
          dashArray: '5, 10'
        }).addTo(mapInstance.current);
        
        // Remove after next update
        setTimeout(() => {
          if (mapInstance.current && mapInstance.current.hasLayer(remainingLine)) {
            mapInstance.current.removeLayer(remainingLine);
          }
        }, 7000);
      }
    }
    
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

    // Add tile layer with multiple map styles
    const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    });

    // Satellite style alternative
    const satelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    });

    // Dark mode style
    const darkLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    });

    // Add default layer
    osmLayer.addTo(map);

    // Layer control for switching map styles
    const baseLayers = {
      "Street Map": osmLayer,
      "Satellite": satelliteLayer,
      "Dark Mode": darkLayer
    };
    L.control.layers(baseLayers).addTo(map);

    // Add interactive click events on map
    map.on('click', function(e) {
      const { lat, lng } = e.latlng;
      
      // Create temporary marker for clicked location
      const tempMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; font-family: system-ui; padding: 10px;">
            <div style="font-size: 16px; font-weight: bold; color: #6366f1; margin-bottom: 8px;">
              📍 Selected Location
            </div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 8px;">
              Lat: ${lat.toFixed(6)}<br>
              Lng: ${lng.toFixed(6)}
            </div>
            <div style="display: flex; gap: 6px; justify-content: center;">
              <button onclick="this.closest('.leaflet-popup').style.display='none'" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                ❌ Remove
              </button>
              <button onclick="alert('Setting as delivery location...')" style="background: #10b981; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                🏠 Set as Delivery
              </button>
            </div>
          </div>
        `)
        .openPopup();

      // Remove marker after 10 seconds
      setTimeout(() => {
        if (map.hasLayer(tempMarker)) {
          map.removeLayer(tempMarker);
        }
      }, 10000);
    });

    // Add zoom controls with custom styling
    map.addControl(L.control.zoom({
      position: 'bottomright'
    }));

    // Add scale control
    L.control.scale({
      position: 'bottomleft',
      metric: true,
      imperial: false
    }).addTo(map);

    // Add fullscreen control (custom implementation)
    const fullscreenControl = L.Control.extend({
      onAdd: function(map: any) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.backgroundImage = "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3\"/></svg>')";
        container.style.backgroundSize = '16px 16px';
        container.style.backgroundPosition = 'center';
        container.style.backgroundRepeat = 'no-repeat';
        container.style.width = '30px';
        container.style.height = '30px';
        container.style.cursor = 'pointer';
        container.title = 'Toggle Fullscreen';
        
        container.onclick = function() {
          const mapContainer = mapRef.current;
          if (mapContainer) {
            if (!document.fullscreenElement) {
              mapContainer.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }
        };
        
        return container;
      }
    });
    
    map.addControl(new fullscreenControl({ position: 'topright' }));

    // Add custom search control
    const searchControl = L.Control.extend({
      onAdd: function(map: any) {
        const container = L.DomUtil.create('div', 'leaflet-control-search');
        container.innerHTML = `
          <div style="background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 8px; margin: 10px;">
            <input 
              type="text" 
              placeholder="🔍 Search location..." 
              style="border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 12px; width: 200px; font-size: 14px; outline: none;"
              id="map-search-input"
            />
            <button 
              onclick="handleMapSearch()" 
              style="background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; margin-left: 8px; cursor: pointer; font-size: 14px;"
            >
              Search
            </button>
          </div>
        `;
        
        // Add search functionality
        (window as any).handleMapSearch = function() {
          const input = document.getElementById('map-search-input') as HTMLInputElement;
          const query = input.value.trim();
          
          if (query) {
            // Simple geocoding simulation (in real app, use Nominatim API)
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
              .then(response => response.json())
              .then(data => {
                if (data.length > 0) {
                  const result = data[0];
                  const lat = parseFloat(result.lat);
                  const lng = parseFloat(result.lon);
                  
                  map.setView([lat, lng], 15);
                  
                  // Add search result marker
                  const searchMarker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(`
                      <div style="text-align: center; font-family: system-ui; padding: 10px;">
                        <div style="font-size: 16px; font-weight: bold; color: #8b5cf6; margin-bottom: 8px;">
                          🔍 Search Result
                        </div>
                        <div style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">
                          ${result.display_name}
                        </div>
                        <button onclick="map.removeLayer(this)" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                          Remove Marker
                        </button>
                      </div>
                    `)
                    .openPopup();
                    
                  // Remove search marker after 30 seconds
                  setTimeout(() => {
                    if (map.hasLayer(searchMarker)) {
                      map.removeLayer(searchMarker);
                    }
                  }, 30000);
                } else {
                  alert('Location not found. Please try a different search term.');
                }
              })
              .catch(error => {
                console.error('Search error:', error);
                alert('Search failed. Please try again.');
              });
          }
        };
        
        return container;
      }
    });
    
    map.addControl(new searchControl({ position: 'topleft' }));

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

    // Add markers with enhanced interactive popups
    const pharmacyMarker = L.marker([pharmacyLocation.lat, pharmacyLocation.lng], { icon: pharmacyIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; font-family: system-ui; padding: 12px; min-width: 200px;">
          <div style="font-size: 18px; font-weight: bold; color: #10b981; margin-bottom: 8px;">
            🏥 ${pharmacyLocation.name || 'Pharmacy'}
          </div>
          <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Pickup Location</div>
          <div style="margin-bottom: 8px; padding: 6px 12px; background: #f0fdf4; border-radius: 12px; color: #166534; font-size: 13px;">
            ✅ Order Ready for Pickup
          </div>
          <div style="display: flex; gap: 8px; justify-content: center; margin-top: 10px;">
            <button onclick="alert('Calling pharmacy...')" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              📞 Call
            </button>
            <button onclick="alert('Getting directions...')" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              🗺️ Directions
            </button>
          </div>
        </div>
      `);

    const destinationMarker = L.marker([deliveryLocation.lat, deliveryLocation.lng], { icon: destinationIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; font-family: system-ui; padding: 12px; min-width: 200px;">
          <div style="font-size: 18px; font-weight: bold; color: #ef4444; margin-bottom: 8px;">
            🏠 Your Location
          </div>
          <div style="color: #6b7280; font-size: 13px; line-height: 1.4; margin-bottom: 8px;">
            ${deliveryLocation.address || 'Delivery Address'}
          </div>
          <div style="margin-bottom: 8px; padding: 6px 12px; background: #fef2f2; border-radius: 12px; color: #991b1b; font-size: 13px;">
            📦 Delivery Destination
          </div>
          <div style="display: flex; gap: 8px; justify-content: center; margin-top: 10px;">
            <button onclick="alert('Updating address...')" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              📝 Edit Address
            </button>
            <button onclick="alert('Adding delivery notes...')" style="background: #8b5cf6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              📋 Add Notes
            </button>
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

      {/* Real-Time Order Progress Tracker */}
      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">📦 Order Progress</h3>
        <div className="space-y-3">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${orderProgress.orderPlaced ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                {orderProgress.orderPlaced ? '✓' : '1'}
              </div>
              <span className="text-sm font-medium">Order Placed</span>
            </div>
            <span className="text-xs text-gray-500">✅ Completed</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${orderProgress.medicinesPrepared ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                {orderProgress.medicinesPrepared ? '✓' : '2'}
              </div>
              <span className="text-sm font-medium">Medicines Prepared</span>
            </div>
            <span className="text-xs text-gray-500">🏥 At Pharmacy</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${orderProgress.pickedUp ? 'bg-green-500 text-white' : orderProgress.driverAssigned ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>
                {orderProgress.pickedUp ? '✓' : orderProgress.driverAssigned ? '🚚' : '3'}
              </div>
              <span className="text-sm font-medium">
                {orderProgress.pickedUp ? 'Picked Up' : orderProgress.driverAssigned ? 'Driver Assigned' : 'Awaiting Pickup'}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {orderProgress.pickedUp ? '📦 In Transit' : orderProgress.driverAssigned ? '🚗 Driver En Route' : '⏳ Pending'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${orderProgress.nearDestination ? 'bg-blue-500 text-white animate-pulse' : orderProgress.onTheWay ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>
                {orderProgress.nearDestination ? '📍' : orderProgress.onTheWay ? '🚚' : '4'}
              </div>
              <span className="text-sm font-medium">
                {orderProgress.nearDestination ? 'Near Your Location' : orderProgress.onTheWay ? 'On The Way' : 'Out for Delivery'}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {orderProgress.nearDestination ? '🎯 Almost There!' : orderProgress.onTheWay ? `📏 ${estimatedDistance.toFixed(1)} km away` : '🚛 Starting Journey'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${orderProgress.delivered ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                {orderProgress.delivered ? '✓' : '5'}
              </div>
              <span className="text-sm font-medium">Delivered</span>
            </div>
            <span className="text-xs text-gray-500">
              {orderProgress.delivered ? '🎉 Completed' : '⏳ Pending'}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round((Object.values(orderProgress).filter(Boolean).length / Object.keys(orderProgress).length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(Object.values(orderProgress).filter(Boolean).length / Object.keys(orderProgress).length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <div ref={mapRef} className="w-full h-96" />
        
        {/* Enhanced Map Controls Overlay */}
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
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (mapInstance.current) {
                mapInstance.current.setView([deliveryLocation.lat, deliveryLocation.lng], 15);
              }
            }}
            className="bg-white/90 backdrop-blur-sm shadow-md"
          >
            🏠 My Location
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (mapInstance.current) {
                mapInstance.current.setView([pharmacyLocation.lat, pharmacyLocation.lng], 15);
              }
            }}
            className="bg-white/90 backdrop-blur-sm shadow-md"
          >
            🏥 Pharmacy
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (mapInstance.current && currentLocation) {
                mapInstance.current.setView([currentLocation.lat, currentLocation.lng], 16);
              }
            }}
            className="bg-white/90 backdrop-blur-sm shadow-md"
            disabled={!currentLocation}
          >
            🚚 Driver
          </Button>
        </div>

        {/* Enhanced Map Legend with Real-Time Data */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md min-w-[220px]">
          <h3 className="font-semibold text-sm mb-3 text-gray-800">📍 Live Tracking Data</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs">🏥</div>
                <span>Pharmacy</span>
              </div>
              <span className="text-xs text-green-600 font-medium">
                {orderProgress.medicinesPrepared ? '✅ Ready' : '⏳ Preparing'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs">🚚</div>
                <span>Driver</span>
              </div>
              <span className={`text-xs font-medium ${isLiveTracking ? 'text-blue-600' : 'text-gray-400'}`}>
                {orderProgress.nearDestination ? '🎯 Near You' : orderProgress.onTheWay ? '🚗 En Route' : orderProgress.pickedUp ? '📦 Picked Up' : '⏳ Assigned'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs">🏠</div>
                <span>Your Location</span>
              </div>
              <span className="text-xs text-red-600 font-medium">
                {orderProgress.delivered ? '✅ Delivered' : '📍 Destination'}
              </span>
            </div>
            
            {/* Real-Time Stats */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>📏 Distance:</span>
                <span className="font-medium text-blue-600">
                  {estimatedDistance > 0 ? `${estimatedDistance.toFixed(1)} km` : 'Calculating...'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>⏰ ETA:</span>
                <span className="font-medium text-green-600">{estimatedTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>📊 Progress:</span>
                <span className="font-medium text-purple-600">
                  {Math.round((Object.values(orderProgress).filter(Boolean).length / Object.keys(orderProgress).length) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>🔄 Last Update:</span>
                <span className="font-medium text-gray-600">
                  {lastUpdate.toLocaleTimeString().slice(0, 5)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button for Quick Actions */}
        <div className="absolute bottom-4 right-4">
          <div className="relative">
            <Button
              size="lg"
              className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 shadow-lg"
              onClick={() => {
                const actions = [
                  '📞 Call Delivery Agent',
                  '📍 Share Live Location',
                  '⏰ Change Delivery Time',
                  '💬 Send Message',
                  '🔄 Refresh Tracking'
                ];
                const action = actions[Math.floor(Math.random() * actions.length)];
                alert(`Action: ${action}`);
              }}
            >
              ⚡
            </Button>
            
            {/* Quick Stats Badge */}
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
              {isLiveTracking ? '●' : '○'}
            </div>
          </div>
        </div>

        {/* Interactive Notification Banner */}
        {isLiveTracking && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              <span>Live tracking active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
