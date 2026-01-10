import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Play, Square, CheckCircle, AlertTriangle } from 'lucide-react';
import { Mission } from '@/data/types';
import { toast } from 'sonner';

export default function Missions() {
  const { state, dispatch } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'patrol' as Mission['type'],
    droneId: '',
    siteId: '',
  });

  const handleCreateMission = () => {
    if (!formData.name || !formData.droneId || !formData.siteId) {
      toast.error('Please fill in all fields');
      return;
    }

    const drone = state.drones.find(d => d.id === formData.droneId);
    if (drone?.status !== 'idle') {
      toast.error('Selected drone is not available');
      return;
    }

    const newMission: Mission = {
      id: `mission-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      status: 'in-progress',
      droneId: formData.droneId,
      siteId: formData.siteId,
      startTime: new Date().toISOString(),
      progress: 0,
    };

    dispatch({ type: 'ADD_MISSION', payload: newMission });
    
    // Update drone status
    dispatch({
      type: 'UPDATE_DRONE',
      payload: { ...drone!, status: 'active', currentMission: newMission.id },
    });

    setIsCreateModalOpen(false);
    setFormData({ name: '', type: 'patrol', droneId: '', siteId: '' });
    toast.success('Mission created and started');
  };

  const handleAbortMission = (mission: Mission) => {
    const drone = state.drones.find(d => d.id === mission.droneId);
    
    dispatch({
      type: 'UPDATE_MISSION',
      payload: { ...mission, status: 'aborted', endTime: new Date().toISOString() },
    });

    if (drone) {
      dispatch({
        type: 'UPDATE_DRONE',
        payload: { ...drone, status: 'idle', currentMission: undefined },
      });
    }

    toast.success('Mission aborted');
  };

  const handleCompleteMission = (mission: Mission) => {
    const drone = state.drones.find(d => d.id === mission.droneId);
    
    dispatch({
      type: 'UPDATE_MISSION',
      payload: { ...mission, status: 'completed', progress: 100, endTime: new Date().toISOString() },
    });

    if (drone) {
      dispatch({
        type: 'UPDATE_DRONE',
        payload: { ...drone, status: 'idle', currentMission: undefined },
      });
    }

    toast.success('Mission completed');
  };

  const getStatusBadge = (status: Mission['status']) => {
    const styles = {
      pending: 'badge-muted',
      'in-progress': 'badge-active',
      completed: 'badge-active',
      aborted: 'badge-danger',
    };
    const labels = {
      pending: 'Pending',
      'in-progress': 'In Progress',
      completed: 'Completed',
      aborted: 'Aborted',
    };
    return <span className={styles[status]}>{labels[status]}</span>;
  };

  const getTypeBadge = (type: Mission['type']) => {
    const labels = {
      patrol: 'Patrol',
      inspection: 'Inspection',
      survey: 'Survey',
      emergency: 'Emergency',
    };
    return <span className="badge-muted">{labels[type]}</span>;
  };

  const availableDrones = state.drones.filter(d => d.status === 'idle');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Missions</h1>
            <p className="text-muted-foreground">Create and manage drone missions</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Mission
          </Button>
        </div>

        {/* Mission Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-primary">
              {state.missions.filter(m => m.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-primary">
              {state.missions.filter(m => m.status === 'completed').length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-foreground">
              {state.missions.filter(m => m.status === 'pending').length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Aborted</p>
            <p className="text-2xl font-bold text-destructive">
              {state.missions.filter(m => m.status === 'aborted').length}
            </p>
          </div>
        </div>

        {/* Mission List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="data-table">
            <thead className="bg-secondary/50">
              <tr>
                <th>Mission</th>
                <th>Type</th>
                <th>Drone</th>
                <th>Site</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.missions.map(mission => {
                const drone = state.drones.find(d => d.id === mission.droneId);
                const site = state.sites.find(s => s.id === mission.siteId);
                return (
                  <tr key={mission.id}>
                    <td className="font-medium text-foreground">{mission.name}</td>
                    <td>{getTypeBadge(mission.type)}</td>
                    <td className="text-muted-foreground">{drone?.name || '-'}</td>
                    <td className="text-muted-foreground">{site?.name || '-'}</td>
                    <td>{getStatusBadge(mission.status)}</td>
                    <td>
                      {mission.status === 'in-progress' ? (
                        <div className="flex items-center gap-2">
                          <Progress value={mission.progress} className="w-20 h-2" />
                          <span className="text-sm text-primary">{mission.progress}%</span>
                        </div>
                      ) : mission.status === 'completed' ? (
                        <span className="text-primary">100%</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td>
                      {mission.status === 'in-progress' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleCompleteMission(mission)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAbortMission(mission)}
                          >
                            <Square className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Create Mission Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Mission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="mission-name">Mission Name</Label>
                <Input
                  id="mission-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Evening Patrol - SF"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission-type">Mission Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as Mission['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patrol">Patrol</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission-site">Site</Label>
                <Select
                  value={formData.siteId}
                  onValueChange={(value) => setFormData({ ...formData, siteId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission-drone">Assign Drone</Label>
                <Select
                  value={formData.droneId}
                  onValueChange={(value) => setFormData({ ...formData, droneId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select drone" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrones.length > 0 ? (
                      availableDrones.map(drone => (
                        <SelectItem key={drone.id} value={drone.id}>
                          {drone.name} ({drone.battery}% battery)
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No drones available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {availableDrones.length === 0 && (
                  <p className="text-sm text-warning flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    All drones are currently in use
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateMission} disabled={availableDrones.length === 0}>
                <Play className="w-4 h-4 mr-2" />
                Start Mission
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
