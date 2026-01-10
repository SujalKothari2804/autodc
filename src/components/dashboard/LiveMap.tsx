import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '@/context/AppContext';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DronePositionData {
  id: string;
  lat: number;
  lng: number;
  speed: number;
  altitude: number;
  heading: number;
}

interface LiveMapProps {
  onDroneSelect?: (droneId: string) => void;
  selectedDroneId?: string | null;
}

export function LiveMap({ onDroneSelect, selectedDroneId }: LiveMapProps) {
  const { state } = useApp();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [dronePositions, setDronePositions] = useState<DronePositionData[]>([]);

  // Initialize positions from drones
  useEffect(() => {
    const activeDrones = state.drones.filter(d => d.status === 'active');
    const positions = activeDrones.map(drone => ({
      id: drone.id,
      lat: drone.location.lat,
      lng: drone.location.lng,
      speed: Math.random() * 30 + 20,
      altitude: Math.random() * 100 + 50,
      heading: Math.random() * 360,
    }));
    setDronePositions(positions);
  }, [state.drones]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [40.7128, -74.006],
      zoom: 4,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Create drone icon
  const createDroneIcon = useCallback((isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-drone-marker',
      html: `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(0, 255, 255, 0.2);
            animation: pulse 2s infinite;
          "></div>
          <div style="
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: ${isSelected ? '#00ffff' : '#00d4d4'};
            border: 2px solid ${isSelected ? '#ffffff' : '#00ffff'};
            box-shadow: 0 0 ${isSelected ? '12px' : '8px'} rgba(0, 255, 255, 0.5);
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  // Update markers when positions change
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Update or create markers
    dronePositions.forEach(position => {
      const drone = state.drones.find(d => d.id === position.id);
      const isSelected = selectedDroneId === position.id;
      
      let marker = markersRef.current.get(position.id);
      
      if (marker) {
        // Update existing marker position
        marker.setLatLng([position.lat, position.lng]);
        marker.setIcon(createDroneIcon(isSelected));
      } else {
        // Create new marker
        marker = L.marker([position.lat, position.lng], {
          icon: createDroneIcon(isSelected),
        }).addTo(map);

        marker.bindPopup(`
          <div style="background: #1a2332; padding: 8px; border-radius: 6px; margin: -14px -20px -13px -20px;">
            <p style="font-weight: bold; color: #00ffff; margin: 0;">${drone?.name || position.id}</p>
            <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 8px 0;">${drone?.location.city || 'Unknown'}</p>
            <div style="font-size: 11px; color: #d1d5db;">
              <p style="margin: 2px 0;">Speed: ${position.speed.toFixed(1)} km/h</p>
              <p style="margin: 2px 0;">Altitude: ${position.altitude.toFixed(0)} m</p>
              <p style="margin: 2px 0;">Heading: ${position.heading.toFixed(0)}°</p>
            </div>
          </div>
        `);

        marker.on('click', () => {
          if (onDroneSelect) {
            onDroneSelect(position.id);
          }
        });

        markersRef.current.set(position.id, marker);
      }
    });

    // Remove markers for drones no longer active
    markersRef.current.forEach((marker, id) => {
      if (!dronePositions.find(p => p.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [dronePositions, selectedDroneId, state.drones, createDroneIcon, onDroneSelect]);

  // Fly to selected drone
  useEffect(() => {
    if (!mapRef.current || !selectedDroneId) return;

    const position = dronePositions.find(p => p.id === selectedDroneId);
    if (position) {
      mapRef.current.flyTo([position.lat, position.lng], 10, { duration: 1.5 });
    }
  }, [selectedDroneId, dronePositions]);

  // Simulate drone movement every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDronePositions(prev => 
        prev.map(pos => ({
          ...pos,
          lat: pos.lat + (Math.random() - 0.5) * 0.002,
          lng: pos.lng + (Math.random() - 0.5) * 0.002,
          speed: Math.max(15, Math.min(60, pos.speed + (Math.random() - 0.5) * 5)),
          altitude: Math.max(30, Math.min(150, pos.altitude + (Math.random() - 0.5) * 10)),
          heading: (pos.heading + (Math.random() - 0.5) * 20 + 360) % 360,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '300px' }}
    />
  );
}

// Custom hook for drone positions - used by telemetry panel
export function useDronePositions() {
  const { state } = useApp();
  const [positions, setPositions] = useState<DronePositionData[]>([]);

  useEffect(() => {
    const activeDrones = state.drones.filter(d => d.status === 'active');
    const initialPositions = activeDrones.map(drone => ({
      id: drone.id,
      lat: drone.location.lat,
      lng: drone.location.lng,
      speed: Math.random() * 30 + 20,
      altitude: Math.random() * 100 + 50,
      heading: Math.random() * 360,
    }));
    setPositions(initialPositions);
  }, [state.drones]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => 
        prev.map(pos => ({
          ...pos,
          lat: pos.lat + (Math.random() - 0.5) * 0.002,
          lng: pos.lng + (Math.random() - 0.5) * 0.002,
          speed: Math.max(15, Math.min(60, pos.speed + (Math.random() - 0.5) * 5)),
          altitude: Math.max(30, Math.min(150, pos.altitude + (Math.random() - 0.5) * 10)),
          heading: (pos.heading + (Math.random() - 0.5) * 20 + 360) % 360,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return positions;
}
