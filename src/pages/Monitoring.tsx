import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { LiveMap } from '@/components/dashboard/LiveMap';
import { Progress } from '@/components/ui/progress';
import { Battery, Gauge, Mountain, Navigation, X, MapPin, Radio } from 'lucide-react';
import { useDronePositions } from '@/components/dashboard/LiveMap';
import { Button } from '@/components/ui/button';

export default function Monitoring() {
  const { state } = useApp();
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);
  const [isPanelLocked, setIsPanelLocked] = useState(false);
  const positions = useDronePositions();

  const handleDroneSelect = (droneId: string) => {
    if (selectedDroneId === droneId && !isPanelLocked) {
      setSelectedDroneId(null);
    } else {
      setSelectedDroneId(droneId);
      setIsPanelLocked(true);
    }
  };

  const handleClosePanel = () => {
    setSelectedDroneId(null);
    setIsPanelLocked(false);
  };

  const activeDrones = state.drones.filter(d => d.status === 'active');
  const selectedDrone = state.drones.find(d => d.id === selectedDroneId);
  const selectedPosition = positions.find(p => p.id === selectedDroneId);
  const currentMission = selectedDrone?.currentMission
    ? state.missions.find(m => m.id === selectedDrone.currentMission)
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Monitoring</h1>
          <p className="text-muted-foreground">Real-time drone tracking and telemetry</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Active Drones List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Active Drones</h2>
            <div className="space-y-2">
              {activeDrones.map(drone => {
                const position = positions.find(p => p.id === drone.id);
                const isSelected = selectedDroneId === drone.id;
                return (
                  <button
                    key={drone.id}
                    onClick={() => handleDroneSelect(drone.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-primary/10 border-primary'
                        : 'bg-card border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{drone.name}</span>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Battery className="w-3 h-3" />
                        <span>{drone.battery}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3" />
                        <span>{position?.speed.toFixed(0) || '--'} km/h</span>
                      </div>
                    </div>
                  </button>
                );
              })}
              {activeDrones.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No active drones
                </p>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-4 h-[500px]">
              <LiveMap 
                onDroneSelect={handleDroneSelect}
                selectedDroneId={selectedDroneId}
              />
            </div>
          </div>

          {/* Telemetry Panel */}
          <div>
            {selectedDrone && selectedPosition ? (
              <div className="bg-card border border-border rounded-lg p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedDrone.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedDrone.model}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Live Status */}
                  <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
                    <Radio className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm text-primary font-medium">Live Feed Active</span>
                  </div>

                  {/* Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Battery className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Battery</span>
                      </div>
                      <p className="text-xl font-bold text-primary">{selectedDrone.battery}%</p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Gauge className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Speed</span>
                      </div>
                      <p className="text-xl font-bold text-primary">
                        {selectedPosition.speed.toFixed(1)}
                        <span className="text-xs font-normal ml-1">km/h</span>
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Mountain className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Altitude</span>
                      </div>
                      <p className="text-xl font-bold text-primary">
                        {selectedPosition.altitude.toFixed(0)}
                        <span className="text-xs font-normal ml-1">m</span>
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Navigation className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Heading</span>
                      </div>
                      <p className="text-xl font-bold text-primary">
                        {selectedPosition.heading.toFixed(0)}°
                      </p>
                    </div>
                  </div>

                  {/* Current Mission */}
                  {currentMission && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Current Mission</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{currentMission.name}</p>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary">{currentMission.progress}%</span>
                      </div>
                      <Progress value={currentMission.progress} className="h-2" />
                    </div>
                  )}

                  {/* Location */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">{selectedDrone.location.city}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col items-center justify-center text-center">
                <Radio className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-foreground mb-2">No Drone Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a drone from the list or map to view live telemetry
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
