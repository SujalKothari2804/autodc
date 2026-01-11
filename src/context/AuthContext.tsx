import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user database - AutoDC branded
const MOCK_USERS: { email: string; password: string; user: AuthUser }[] = [
  {
    email: 'admin@autodc.com',
    password: 'admin123',
    user: {
      id: 'user-001',
      name: 'John Smith',
      email: 'admin@autodc.com',
      role: 'admin',
    },
  },
  {
    email: 'operator@autodc.com',
    password: 'operator123',
    user: {
      id: 'user-002',
      name: 'Sarah Johnson',
      email: 'operator@autodc.com',
      role: 'operator',
    },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session on mount
    const storedSession = localStorage.getItem('autodc_session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (session.expiresAt > Date.now()) {
          setUser(session.user);
        } else {
          localStorage.removeItem('autodc_session');
        }
      } catch {
        localStorage.removeItem('autodc_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setUser(foundUser.user);
      
      if (rememberMe) {
        const session = {
          user: foundUser.user,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        };
        localStorage.setItem('autodc_session', JSON.stringify(session));
      }
      
      return true;
    }

    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user already exists
    const exists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return false;
    }

    // Create new user (in real app, this would be saved to database)
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'viewer', // Default role for new signups
    };

    MOCK_USERS.push({ email, password, user: newUser });
    setUser(newUser);

    const session = {
      user: newUser,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem('autodc_session', JSON.stringify(session));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('autodc_session');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In real app, this would send a password reset email
    const exists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
    return exists;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
