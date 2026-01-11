import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { LiveMap } from '@/components/dashboard/LiveMap';
import { DroneTelemetryPanel } from '@/components/dashboard/DroneTelemetryPanel';
import { useApp } from '@/context/AppContext';
import { Plane, Clock, CheckCircle, Activity } from 'lucide-react';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);

  const activeMissions = state.missions.filter(m => m.status === 'in-progress').length;
  const availableDrones = state.drones.filter(d => d.status === 'idle' || d.status === 'active').length;
  const totalFlightHours = state.drones.reduce((sum, d) => sum + d.totalFlightHours, 0);
  const completedMissions = state.missions.filter(m => m.status === 'completed').length;
  const abortedMissions = state.missions.filter(m => m.status === 'aborted').length;
  const finishedMissions = completedMissions + abortedMissions;
  // Calculate success rate from completed missions, default to 96% if no data
  const successRate = finishedMissions > 0 
    ? ((completedMissions / finishedMissions) * 100).toFixed(0) 
    : '96';

  const handleDroneSelect = (droneId: string) => {
    if (selectedDroneId === droneId) {
      setSelectedDroneId(null);
    } else {
      setSelectedDroneId(droneId);
    }
  };

  const handleClosePanel = () => {
    setSelectedDroneId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of your drone operations</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Active Missions"
            value={activeMissions}
            icon={<Activity className="w-6 h-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="Available Drones"
            value={availableDrones}
            icon={<Plane className="w-6 h-6" />}
          />
          <KPICard
            title="Total Flight Hours"
            value={totalFlightHours.toLocaleString()}
            icon={<Clock className="w-6 h-6" />}
            trend={{ value: 8, isPositive: true }}
          />
          <KPICard
            title="Success Rate"
            value={`${successRate}%`}
            icon={<CheckCircle className="w-6 h-6" />}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Live Map and Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Live Mission Tracking</h2>
              <div className="h-[400px]">
                <LiveMap 
                  onDroneSelect={handleDroneSelect}
                  selectedDroneId={selectedDroneId}
                />
              </div>
            </div>
          </div>

          <div>
            {selectedDroneId ? (
              <DroneTelemetryPanel 
                droneId={selectedDroneId} 
                onClose={handleClosePanel}
              />
            ) : (
              <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col items-center justify-center text-center">
                <Plane className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-foreground mb-2">Select a Drone</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a drone marker on the map to view real-time telemetry data
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Active Missions</h2>
          <div className="space-y-3">
            {state.missions
              .filter(m => m.status === 'in-progress')
              .map(mission => {
                const drone = state.drones.find(d => d.id === mission.droneId);
                const site = state.sites.find(s => s.id === mission.siteId);
                return (
                  <div 
                    key={mission.id} 
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <div>
                        <p className="font-medium text-foreground">{mission.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {drone?.name} • {site?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{mission.progress}%</p>
                        <p className="text-xs text-muted-foreground">Progress</p>
                      </div>
                      <div className="w-24">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${mission.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            {state.missions.filter(m => m.status === 'in-progress').length === 0 && (
              <p className="text-center text-muted-foreground py-4">No active missions</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
