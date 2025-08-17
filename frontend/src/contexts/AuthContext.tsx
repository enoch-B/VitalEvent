import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'registrar' | 'registrant' | 'admin' | 'office_manager' | 'health_institution' | 'court' | 'religious_institution';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  indexNumber?: string; // For registrants
  institutionName?: string; // For institutions
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  signup: (indexNumber: string, personalDetails: any) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.registrar@veims.gov',
    role: 'registrar',
    permissions: ['create_records', 'update_records', 'view_records', 'generate_reports']
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane.citizen@email.com',
    role: 'registrant',
    indexNumber: 'ID123456789',
    permissions: ['view_own_records']
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@veims.gov',
    role: 'admin',
    permissions: ['manage_users', 'system_config', 'view_all_records']
  },
  {
    id: '4',
    name: 'Sarah Manager',
    email: 'sarah.manager@veims.gov',
    role: 'office_manager',
    permissions: ['generate_predictions', 'view_reports', 'update_records']
  },
  {
    id: '5',
    name: 'City General Hospital',
    email: 'records@cityhospital.org',
    role: 'health_institution',
    institutionName: 'City General Hospital',
    permissions: ['register_births', 'register_deaths', 'generate_reports']
  },
  {
    id: '6',
    name: 'City Court System',
    email: 'court@citycourt.gov',
    role: 'court',
    institutionName: 'City Court System',
    permissions: ['register_divorces', 'register_adoptions', 'generate_reports']
  },
  {
    id: '7',
    name: 'St. Mary Church',
    email: 'marriage@stmarychurch.org',
    role: 'religious_institution',
    institutionName: 'St. Mary Church',
    permissions: ['register_marriages', 'generate_reports']
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('veims_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('veims_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (indexNumber: string, personalDetails: any): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock signup for registrants
    if (indexNumber === 'ID123456789') {
      const newUser: User = {
        id: Date.now().toString(),
        name: personalDetails.name,
        email: personalDetails.email,
        role: 'registrant',
        indexNumber,
        permissions: ['view_own_records']
      };
      
      setUser(newUser);
      localStorage.setItem('veims_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('veims_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}