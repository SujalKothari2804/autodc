import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '@/context/AppContext';

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

  useEffect(() => {
    const active = state.drones.filter(d => d.status === 'active');
    setDronePositions(active.map(drone => ({
      id: drone.id,
      lat: drone.location.lat,
      lng: drone.location.lng,
      speed: Math.random() * 30 + 20,
      altitude: Math.random() * 100 + 50,
      heading: Math.random() * 360,
    })));
  }, [state.drones]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [40.7128, -74.006],
      zoom: 5,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const createDroneIcon = useCallback((isSelected: boolean) => {
    return L.divIcon({
      className: '',
      html: `
        <div class="drone-marker ${isSelected ? 'selected' : ''}">
          <div class="drone-marker-pulse"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    dronePositions.forEach(position => {
      const drone = state.drones.find(d => d.id === position.id);
      const isSelected = selectedDroneId === position.id;

      let marker = markersRef.current.get(position.id);

      if (marker) {
        marker.setLatLng([position.lat, position.lng]);
        marker.setIcon(createDroneIcon(isSelected));
      } else {
        marker = L.marker([position.lat, position.lng], {
          icon: createDroneIcon(isSelected),
        }).addTo(map);

        marker.bindPopup(`
          <div style="padding:8px">
            <strong>${drone?.name || position.id}</strong><br/>
            ${drone?.location.city || 'Unknown'}<br/>
            Speed: ${position.speed.toFixed(1)} km/h<br/>
            Altitude: ${position.altitude.toFixed(0)} m<br/>
            Heading: ${position.heading.toFixed(0)}°
          </div>
        `);

        marker.on('click', () => onDroneSelect?.(position.id));

        markersRef.current.set(position.id, marker);
      }
    });

    markersRef.current.forEach((marker, id) => {
      if (!dronePositions.find(p => p.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [dronePositions, selectedDroneId, state.drones, createDroneIcon, onDroneSelect]);

  useEffect(() => {
    if (!mapRef.current || !selectedDroneId) return;
    const pos = dronePositions.find(p => p.id === selectedDroneId);
    if (pos) mapRef.current.flyTo([pos.lat, pos.lng], 10, { duration: 1.2 });
  }, [selectedDroneId, dronePositions]);

  useEffect(() => {
    const i = setInterval(() => {
      setDronePositions(prev => prev.map(p => ({
        ...p,
        lat: p.lat + (Math.random() - 0.5) * 0.002,
        lng: p.lng + (Math.random() - 0.5) * 0.002,
        speed: Math.max(15, Math.min(60, p.speed + (Math.random() - 0.5) * 5)),
        altitude: Math.max(30, Math.min(150, p.altitude + (Math.random() - 0.5) * 10)),
        heading: (p.heading + (Math.random() - 0.5) * 20 + 360) % 360,
      })));
    }, 2000);

    return () => clearInterval(i);
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: 300 }}
    />
  );
}
