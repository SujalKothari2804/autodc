export interface DroneLocation {
  lat: number;
  lng: number;
  city?: string;
}

export interface Drone {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  battery: number;
  location: DroneLocation;
  lastMaintenance: string;
  totalFlightHours: number;
  currentMission?: string;
  speed?: number;
  altitude?: number;
}

export interface DronePosition {
  droneId: string;
  lat: number;
  lng: number;
  speed: number;
  altitude: number;
  heading: number;
}

export interface Mission {
  id: string;
  name: string;
  type: 'patrol' | 'inspection' | 'survey' | 'emergency';
  status: 'pending' | 'in-progress' | 'completed' | 'aborted';
  droneId: string;
  siteId: string;
  startTime?: string;
  endTime?: string;
  progress?: number;
}

export interface Site {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  address: string;
  type: 'industrial' | 'commercial' | 'residential' | 'infrastructure';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  avatar?: string;
}

export interface ScheduledMission {
  id: string;
  missionName: string;
  droneId: string;
  siteId: string;
  type: 'patrol' | 'inspection' | 'survey';
  scheduledDate: string;
  scheduledTime: string;
  recurring: boolean;
  recurringDays?: string[];
}

export interface AppSettings {
  aiApiKey?: string;
  notificationsEnabled: boolean;
  autoScheduleEnabled: boolean;
  theme: 'dark' | 'light';
}
