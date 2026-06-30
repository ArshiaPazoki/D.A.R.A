export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  memberId: string;
  name: string;
  role: UserRole;
  parentId?: string; // For member hierarchy
  avatar?: string;
}

export interface Property {
  id: string;
  type: 'apartment' | 'villa' | 'land' | 'commercial';
  status: 'available' | 'pending' | 'sold' | 'rented';
  area: number;
  elevator: boolean;
  parkingSpots: number;
  rooms: number;
  yearBuilt: number;
  age: number;
  images: string[];
  ownerId: string;
  price?: number;
  commission?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commission {
  id: string;
  propertyId: string;
  memberId: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: Date;
  paidAt?: Date;
}

export interface Activity {
  id: string;
  type: 'property_added' | 'property_sold' | 'commission_paid' | 'member_added';
  description: string;
  userId: string;
  timestamp: Date;
}

export interface Language {
  code: 'en' | 'fa';
  dir: 'ltr' | 'rtl';
}