import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Drone, Mission, Site, User, ScheduledMission, AppSettings } from '@/data/types';
import { initialDrones, initialMissions, initialSites, initialUsers, initialScheduledMissions } from '@/data/mockData';

interface AppState {
  drones: Drone[];
  missions: Mission[];
  sites: Site[];
  users: User[];
  scheduledMissions: ScheduledMission[];
  settings: AppSettings;
  selectedDroneId: string | null;
}

type AppAction =
  | { type: 'SET_DRONES'; payload: Drone[] }
  | { type: 'ADD_DRONE'; payload: Drone }
  | { type: 'UPDATE_DRONE'; payload: Drone }
  | { type: 'DELETE_DRONE'; payload: string }
  | { type: 'SET_MISSIONS'; payload: Mission[] }
  | { type: 'ADD_MISSION'; payload: Mission }
  | { type: 'UPDATE_MISSION'; payload: Mission }
  | { type: 'DELETE_MISSION'; payload: string }
  | { type: 'ADD_SITE'; payload: Site }
  | { type: 'UPDATE_SITE'; payload: Site }
  | { type: 'DELETE_SITE'; payload: string }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_SCHEDULED_MISSION'; payload: ScheduledMission }
  | { type: 'UPDATE_SCHEDULED_MISSION'; payload: ScheduledMission }
  | { type: 'DELETE_SCHEDULED_MISSION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SELECT_DRONE'; payload: string | null };

const initialState: AppState = {
  drones: initialDrones,
  missions: initialMissions,
  sites: initialSites,
  users: initialUsers,
  scheduledMissions: initialScheduledMissions,
  settings: {
    notificationsEnabled: true,
    autoScheduleEnabled: false,
    theme: 'dark',
  },
  selectedDroneId: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_DRONES':
      return { ...state, drones: action.payload };
    case 'ADD_DRONE':
      return { ...state, drones: [...state.drones, action.payload] };
    case 'UPDATE_DRONE':
      return {
        ...state,
        drones: state.drones.map((d) => (d.id === action.payload.id ? action.payload : d)),
      };
    case 'DELETE_DRONE':
      return { ...state, drones: state.drones.filter((d) => d.id !== action.payload) };
    case 'SET_MISSIONS':
      return { ...state, missions: action.payload };
    case 'ADD_MISSION':
      return { ...state, missions: [...state.missions, action.payload] };
    case 'UPDATE_MISSION':
      return {
        ...state,
        missions: state.missions.map((m) => (m.id === action.payload.id ? action.payload : m)),
      };
    case 'DELETE_MISSION':
      return { ...state, missions: state.missions.filter((m) => m.id !== action.payload) };
    case 'ADD_SITE':
      return { ...state, sites: [...state.sites, action.payload] };
    case 'UPDATE_SITE':
      return {
        ...state,
        sites: state.sites.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };
    case 'DELETE_SITE':
      return { ...state, sites: state.sites.filter((s) => s.id !== action.payload) };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.payload.id ? action.payload : u)),
      };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter((u) => u.id !== action.payload) };
    case 'ADD_SCHEDULED_MISSION':
      return { ...state, scheduledMissions: [...state.scheduledMissions, action.payload] };
    case 'UPDATE_SCHEDULED_MISSION':
      return {
        ...state,
        scheduledMissions: state.scheduledMissions.map((sm) =>
          sm.id === action.payload.id ? action.payload : sm
        ),
      };
    case 'DELETE_SCHEDULED_MISSION':
      return {
        ...state,
        scheduledMissions: state.scheduledMissions.filter((sm) => sm.id !== action.payload),
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SELECT_DRONE':
      return { ...state, selectedDroneId: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
