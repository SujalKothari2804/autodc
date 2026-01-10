import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '@/context/AppContext';
import { Drone } from '@/data/types';

// Custom drone icon
const createDroneIcon = (isSelected: boolean) => {
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
};

interface DronePosition {
  id: string;
  lat: number;
  lng: number;
  speed: number;
  altitude: number;
  heading: number;
}

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 12, { duration: 1.5 });
    }
  }, [center, map]);
  
  return null;
}

interface LiveMapProps {
  onDroneSelect?: (droneId: string) => void;
  selectedDroneId?: string | null;
}

export function LiveMap({ onDroneSelect, selectedDroneId }: LiveMapProps) {
  const { state } = useApp();
  const [dronePositions, setDronePositions] = useState<DronePosition[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

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

  // Center map on selected drone
  useEffect(() => {
    if (selectedDroneId) {
      const position = dronePositions.find(p => p.id === selectedDroneId);
      if (position) {
        setMapCenter([position.lat, position.lng]);
      }
    }
  }, [selectedDroneId, dronePositions]);

  const handleMarkerClick = useCallback((droneId: string) => {
    if (onDroneSelect) {
      onDroneSelect(droneId);
    }
  }, [onDroneSelect]);

  const getDroneName = useCallback((droneId: string) => {
    const drone = state.drones.find(d => d.id === droneId);
    return drone?.name || droneId;
  }, [state.drones]);

  const getDroneCity = useCallback((droneId: string) => {
    const drone = state.drones.find(d => d.id === droneId);
    return drone?.location.city || 'Unknown';
  }, [state.drones]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={[40.7128, -74.006]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController center={mapCenter} />
        
        {dronePositions.map(position => (
          <Marker
            key={position.id}
            position={[position.lat, position.lng]}
            icon={createDroneIcon(selectedDroneId === position.id)}
            eventHandlers={{
              click: () => handleMarkerClick(position.id),
            }}
          >
            <Popup>
              <div className="text-foreground bg-card p-2 -m-3 rounded">
                <p className="font-bold text-primary">{getDroneName(position.id)}</p>
                <p className="text-sm text-muted-foreground">{getDroneCity(position.id)}</p>
                <div className="mt-2 text-xs space-y-1">
                  <p>Speed: {position.speed.toFixed(1)} km/h</p>
                  <p>Altitude: {position.altitude.toFixed(0)} m</p>
                  <p>Heading: {position.heading.toFixed(0)}°</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export function useDronePositions() {
  const { state } = useApp();
  const [positions, setPositions] = useState<DronePosition[]>([]);

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
