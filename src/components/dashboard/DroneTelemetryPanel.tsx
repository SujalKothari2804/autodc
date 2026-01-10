import { X, Battery, Gauge, Mountain, Navigation, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useDronePositions } from './LiveMap';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DroneTelemetryPanelProps {
  droneId: string;
  onClose: () => void;
}

export function DroneTelemetryPanel({ droneId, onClose }: DroneTelemetryPanelProps) {
  const { state } = useApp();
  const positions = useDronePositions();
  
  const drone = state.drones.find(d => d.id === droneId);
  const position = positions.find(p => p.id === droneId);
  const mission = state.missions.find(m => m.droneId === droneId && m.status === 'in-progress');

  if (!drone) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{drone.name}</h3>
          <p className="text-sm text-muted-foreground">{drone.model}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Battery</span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl font-bold text-primary">{drone.battery}%</span>
            </div>
            <Progress value={drone.battery} className="h-2" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Speed</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            {position?.speed.toFixed(1) || '--'} <span className="text-sm font-normal">km/h</span>
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Altitude</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            {position?.altitude.toFixed(0) || '--'} <span className="text-sm font-normal">m</span>
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Heading</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            {position?.heading.toFixed(0) || '--'}°
          </p>
        </div>
      </div>

      {mission && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Current Mission</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{mission.name}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{mission.progress}%</span>
          </div>
          <Progress value={mission.progress} className="h-2" />
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{drone.location.city}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {position?.lat.toFixed(6)}, {position?.lng.toFixed(6)}
        </p>
      </div>
    </div>
  );
}
