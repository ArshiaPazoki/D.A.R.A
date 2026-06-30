'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers } from './mock-data';

interface AuthContextType {
  user: User | null;
  login: (memberId: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; memberId: string; password: string; parentId?: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('dara_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser) as User);
    }
    setIsLoading(false);
  }, []);

  const login = async (memberId: string, password: string): Promise<boolean> => {
    if (password !== 'password123') return false;
    
    const foundUser = mockUsers.find(u => u.memberId === memberId);
    if (!foundUser) return false;

    setUser(foundUser);
    localStorage.setItem('dara_user', JSON.stringify(foundUser));
    return true;
  };

  const register = async (userData: { name: string; memberId: string; password: string; parentId?: string }): Promise<boolean> => {
    const newUser: User = {
      id: String(mockUsers.length + 1),
      memberId: userData.memberId,
      name: userData.name,
      role: 'member',
      parentId: userData.parentId,
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('dara_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dara_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}