import { Drone, Mission, Site, User, ScheduledMission, DronePosition } from './types';

// Initial drone data
export const initialDrones: Drone[] = [
  {
    id: 'drone-001',
    name: 'Falcon-1',
    model: 'DJI Matrice 300 RTK',
    status: 'active',
    battery: 85,
    location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco' },
    lastMaintenance: '2025-12-15',
    totalFlightHours: 342,
    currentMission: 'mission-001',
  },
  {
    id: 'drone-002',
    name: 'Eagle-2',
    model: 'DJI Mavic 3 Enterprise',
    status: 'active',
    battery: 72,
    location: { lat: 40.7128, lng: -74.006, city: 'New York' },
    lastMaintenance: '2025-12-20',
    totalFlightHours: 256,
    currentMission: 'mission-002',
  },
  {
    id: 'drone-003',
    name: 'Hawk-3',
    model: 'Autel EVO II Pro',
    status: 'active',
    battery: 91,
    location: { lat: 51.5074, lng: -0.1278, city: 'London' },
    lastMaintenance: '2025-12-18',
    totalFlightHours: 189,
    currentMission: 'mission-003',
  },
  {
    id: 'drone-004',
    name: 'Osprey-4',
    model: 'DJI Matrice 300 RTK',
    status: 'maintenance',
    battery: 45,
    location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco' },
    lastMaintenance: '2025-11-01',
    totalFlightHours: 567,
  },
  {
    id: 'drone-005',
    name: 'Raven-5',
    model: 'DJI Mavic 3 Enterprise',
    status: 'idle',
    battery: 100,
    location: { lat: 40.7128, lng: -74.006, city: 'New York' },
    lastMaintenance: '2025-12-22',
    totalFlightHours: 78,
  },
];

// Initial missions data
export const initialMissions: Mission[] = [
  {
    id: 'mission-001',
    name: 'SF Perimeter Patrol',
    type: 'patrol',
    status: 'in-progress',
    droneId: 'drone-001',
    siteId: 'site-001',
    startTime: new Date().toISOString(),
    progress: 45,
  },
  {
    id: 'mission-002',
    name: 'NYC Infrastructure Inspection',
    type: 'inspection',
    status: 'in-progress',
    droneId: 'drone-002',
    siteId: 'site-002',
    startTime: new Date().toISOString(),
    progress: 67,
  },
  {
    id: 'mission-003',
    name: 'London Security Sweep',
    type: 'patrol',
    status: 'in-progress',
    droneId: 'drone-003',
    siteId: 'site-003',
    startTime: new Date().toISOString(),
    progress: 23,
  },
];

// Sites data
export const initialSites: Site[] = [
  {
    id: 'site-001',
    name: 'SF Industrial Complex',
    location: { lat: 37.7749, lng: -122.4194 },
    address: '123 Industrial Blvd, San Francisco, CA',
    type: 'industrial',
  },
  {
    id: 'site-002',
    name: 'NYC Financial District',
    location: { lat: 40.7128, lng: -74.006 },
    address: '456 Wall Street, New York, NY',
    type: 'commercial',
  },
  {
    id: 'site-003',
    name: 'London Tech Hub',
    location: { lat: 51.5074, lng: -0.1278 },
    address: '789 Tech Lane, London, UK',
    type: 'commercial',
  },
];

// Users data
export const initialUsers: User[] = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@droneops.com',
    role: 'admin',
    avatar: '',
  },
  {
    id: 'user-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@droneops.com',
    role: 'operator',
    avatar: '',
  },
  {
    id: 'user-003',
    name: 'Mike Wilson',
    email: 'mike.wilson@droneops.com',
    role: 'viewer',
    avatar: '',
  },
];

// Scheduled missions
export const initialScheduledMissions: ScheduledMission[] = [
  {
    id: 'sched-001',
    missionName: 'Morning Patrol - SF',
    droneId: 'drone-001',
    siteId: 'site-001',
    type: 'patrol',
    scheduledDate: '2026-01-11',
    scheduledTime: '06:00',
    recurring: true,
    recurringDays: ['monday', 'wednesday', 'friday'],
  },
  {
    id: 'sched-002',
    missionName: 'Weekly Inspection - NYC',
    droneId: 'drone-002',
    siteId: 'site-002',
    type: 'inspection',
    scheduledDate: '2026-01-12',
    scheduledTime: '10:00',
    recurring: true,
    recurringDays: ['tuesday'],
  },
];

// Analytics data
export const analyticsData = {
  flightHoursPerMonth: [
    { month: 'Jul', hours: 120 },
    { month: 'Aug', hours: 145 },
    { month: 'Sep', hours: 132 },
    { month: 'Oct', hours: 168 },
    { month: 'Nov', hours: 155 },
    { month: 'Dec', hours: 178 },
    { month: 'Jan', hours: 142 },
  ],
  missionsPerType: [
    { type: 'Patrol', count: 156 },
    { type: 'Inspection', count: 89 },
    { type: 'Survey', count: 45 },
    { type: 'Emergency', count: 12 },
  ],
  successRate: [
    { month: 'Jul', rate: 94 },
    { month: 'Aug', rate: 96 },
    { month: 'Sep', rate: 92 },
    { month: 'Oct', rate: 98 },
    { month: 'Nov', rate: 95 },
    { month: 'Dec', rate: 97 },
    { month: 'Jan', rate: 96 },
  ],
  incidentsByType: [
    { type: 'Battery Low', count: 23 },
    { type: 'Connection Lost', count: 8 },
    { type: 'Weather Abort', count: 15 },
    { type: 'Obstacle Detected', count: 5 },
  ],
};
