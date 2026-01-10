import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Plus, CalendarIcon, Clock, Trash2, Repeat } from 'lucide-react';
import { ScheduledMission } from '@/data/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Scheduling() {
  const { state, dispatch } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    missionName: '',
    droneId: '',
    siteId: '',
    type: 'patrol' as 'patrol' | 'inspection' | 'survey',
    scheduledTime: '09:00',
    recurring: false,
  });

  const handleCreateSchedule = () => {
    if (!formData.missionName || !formData.droneId || !formData.siteId || !selectedDate) {
      toast.error('Please fill in all fields');
      return;
    }

    const newSchedule: ScheduledMission = {
      id: `sched-${Date.now()}`,
      missionName: formData.missionName,
      droneId: formData.droneId,
      siteId: formData.siteId,
      type: formData.type,
      scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
      scheduledTime: formData.scheduledTime,
      recurring: formData.recurring,
    };

    dispatch({ type: 'ADD_SCHEDULED_MISSION', payload: newSchedule });
    setIsCreateModalOpen(false);
    setFormData({
      missionName: '',
      droneId: '',
      siteId: '',
      type: 'patrol',
      scheduledTime: '09:00',
      recurring: false,
    });
    toast.success('Mission scheduled successfully');
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    dispatch({ type: 'DELETE_SCHEDULED_MISSION', payload: scheduleId });
    toast.success('Scheduled mission removed');
  };

  const scheduledForDate = selectedDate
    ? state.scheduledMissions.filter(
        sm => sm.scheduledDate === format(selectedDate, 'yyyy-MM-dd')
      )
    : [];

  const allScheduled = state.scheduledMissions;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scheduling</h1>
            <p className="text-muted-foreground">Plan and schedule automated missions</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Mission
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Select Date</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
            />
          </div>

          {/* Scheduled for Selected Date */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h2>
            <div className="space-y-3">
              {scheduledForDate.length > 0 ? (
                scheduledForDate.map(schedule => {
                  const drone = state.drones.find(d => d.id === schedule.droneId);
                  const site = state.sites.find(s => s.id === schedule.siteId);
                  return (
                    <div
                      key={schedule.id}
                      className="p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">{schedule.missionName}</p>
                          <p className="text-sm text-muted-foreground">
                            {drone?.name} • {site?.name}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{schedule.scheduledTime}</span>
                        </div>
                        <span className="badge-muted capitalize">{schedule.type}</span>
                        {schedule.recurring && (
                          <div className="flex items-center gap-1 text-primary">
                            <Repeat className="w-3 h-3" />
                            <span>Recurring</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No missions scheduled for this date
                </p>
              )}
            </div>
          </div>

          {/* All Upcoming */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">All Scheduled</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {allScheduled.map(schedule => {
                const drone = state.drones.find(d => d.id === schedule.droneId);
                return (
                  <div
                    key={schedule.id}
                    className="p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-foreground text-sm">{schedule.missionName}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{schedule.scheduledDate}</span>
                      <Clock className="w-3 h-3 ml-2" />
                      <span>{schedule.scheduledTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{drone?.name}</p>
                  </div>
                );
              })}
              {allScheduled.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No scheduled missions
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Create Schedule Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Mission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Mission Name</Label>
                <Input
                  value={formData.missionName}
                  onChange={(e) => setFormData({ ...formData, missionName: e.target.value })}
                  placeholder="e.g., Morning Patrol"
                />
              </div>
              <div className="space-y-2">
                <Label>Mission Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patrol">Patrol</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Site</Label>
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
                <Label>Assign Drone</Label>
                <Select
                  value={formData.droneId}
                  onValueChange={(value) => setFormData({ ...formData, droneId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select drone" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.drones.map(drone => (
                      <SelectItem key={drone.id} value={drone.id}>
                        {drone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                  className="rounded border-border"
                />
                <Label htmlFor="recurring">Recurring mission</Label>
              </div>
              <div className="pt-2">
                <Label className="text-muted-foreground text-sm">
                  Selected Date: {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'None'}
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSchedule}>Schedule Mission</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
