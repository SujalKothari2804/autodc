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
import { Plus, Pencil, Trash2, Plane } from 'lucide-react';
import { Drone } from '@/data/types';
import { toast } from 'sonner';

export default function Fleet() {
  const { state, dispatch } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDrone, setEditingDrone] = useState<Drone | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    status: 'idle' as Drone['status'],
  });

  const handleAddDrone = () => {
    if (!formData.name || !formData.model) {
      toast.error('Please fill in all fields');
      return;
    }

    const newDrone: Drone = {
      id: `drone-${Date.now()}`,
      name: formData.name,
      model: formData.model,
      status: formData.status,
      battery: 100,
      location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco' },
      lastMaintenance: new Date().toISOString().split('T')[0],
      totalFlightHours: 0,
    };

    dispatch({ type: 'ADD_DRONE', payload: newDrone });
    setIsAddModalOpen(false);
    setFormData({ name: '', model: '', status: 'idle' });
    toast.success('Drone added successfully');
  };

  const handleEditDrone = () => {
    if (!editingDrone || !formData.name || !formData.model) {
      toast.error('Please fill in all fields');
      return;
    }

    const updatedDrone: Drone = {
      ...editingDrone,
      name: formData.name,
      model: formData.model,
      status: formData.status,
    };

    dispatch({ type: 'UPDATE_DRONE', payload: updatedDrone });
    setIsEditModalOpen(false);
    setEditingDrone(null);
    setFormData({ name: '', model: '', status: 'idle' });
    toast.success('Drone updated successfully');
  };

  const handleDeleteDrone = (droneId: string) => {
    dispatch({ type: 'DELETE_DRONE', payload: droneId });
    toast.success('Drone removed successfully');
  };

  const openEditModal = (drone: Drone) => {
    setEditingDrone(drone);
    setFormData({
      name: drone.name,
      model: drone.model,
      status: drone.status,
    });
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status: Drone['status']) => {
    const styles = {
      active: 'badge-active',
      idle: 'badge-muted',
      maintenance: 'badge-warning',
      offline: 'badge-danger',
    };
    return <span className={styles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Fleet Management</h1>
            <p className="text-muted-foreground">Manage and monitor your drone fleet</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Drone
          </Button>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.drones.map(drone => (
            <div key={drone.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plane className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{drone.name}</h3>
                    <p className="text-sm text-muted-foreground">{drone.model}</p>
                  </div>
                </div>
                {getStatusBadge(drone.status)}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Battery Health</span>
                    <span className="text-primary font-medium">{drone.battery}%</span>
                  </div>
                  <Progress value={drone.battery} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Flight Hours</p>
                    <p className="font-medium text-foreground">{drone.totalFlightHours}h</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Maintenance</p>
                    <p className="font-medium text-foreground">{drone.lastMaintenance}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{drone.location.city}</p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditModal(drone)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteDrone(drone.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Drone Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Drone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Drone Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Falcon-6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., DJI Matrice 300 RTK"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Drone['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDrone}>Add Drone</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Drone Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Drone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Drone Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model">Model</Label>
                <Input
                  id="edit-model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Drone['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditDrone}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
