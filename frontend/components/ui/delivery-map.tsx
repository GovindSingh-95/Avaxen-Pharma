"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface DeliveryMapProps {
  pharmacyLocation: { lat: number; lng: number; name: string };
  deliveryLocation: { lat: number; lng: number; address: string };
  currentLocation?: { lat: number; lng: number };
  deliveryStatus: string;
}

export function DeliveryMap({ 
  pharmacyLocation, 
  deliveryLocation, 
  currentLocation, 
  deliveryStatus 
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([pharmacyLocation.lat, pharmacyLocation.lng], 12);
    mapInstance.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom icons
    const pharmacyIcon = L.divIcon({
      html: `<div style="background: #10b981; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px;">🏥</div>`,
      iconSize: [30, 30],
      className: 'custom-pharmacy-icon'
    });

    const deliveryIcon = L.divIcon({
      html: `<div style="background: #ef4444; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px;">🏠</div>`,
      iconSize: [30, 30],
      className: 'custom-delivery-icon'
    });

    const agentIcon = L.divIcon({
      html: `<div style="background: #3b82f6; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">🚚</div>`,
      iconSize: [35, 35],
      className: 'custom-agent-icon'
    });

    // Add pharmacy marker
    L.marker([pharmacyLocation.lat, pharmacyLocation.lng], { icon: pharmacyIcon })
      .addTo(map)
      .bindPopup(`<strong>📍 ${pharmacyLocation.name}</strong><br/>Pharmacy Location`);

    // Add delivery location marker
    L.marker([deliveryLocation.lat, deliveryLocation.lng], { icon: deliveryIcon })
      .addTo(map)
      .bindPopup(`<strong>📍 Delivery Address</strong><br/>${deliveryLocation.address}`);

    // Add current location marker if available
    if (currentLocation) {
      L.marker([currentLocation.lat, currentLocation.lng], { icon: agentIcon })
        .addTo(map)
        .bindPopup(`<strong>🚚 Delivery Agent</strong><br/>Current Location<br/><small>Status: ${deliveryStatus}</small>`);
    }

    // Create route polyline
    const routeCoordinates: [number, number][] = [
      [pharmacyLocation.lat, pharmacyLocation.lng],
    ];

    if (currentLocation) {
      routeCoordinates.push([currentLocation.lat, currentLocation.lng]);
    }
    
    routeCoordinates.push([deliveryLocation.lat, deliveryLocation.lng]);

    // Add route line
    const routeLine = L.polyline(routeCoordinates, {
      color: currentLocation ? '#3b82f6' : '#94a3b8',
      weight: 4,
      opacity: 0.7,
      dashArray: currentLocation ? undefined : '10, 10'
    }).addTo(map);

    // Fit map to show all markers
    const group = new L.FeatureGroup([
      L.marker([pharmacyLocation.lat, pharmacyLocation.lng]),
      L.marker([deliveryLocation.lat, deliveryLocation.lng]),
      ...(currentLocation ? [L.marker([currentLocation.lat, currentLocation.lng])] : [])
    ]);
    
    map.fitBounds(group.getBounds().pad(0.1));

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [pharmacyLocation, deliveryLocation, currentLocation, deliveryStatus]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
