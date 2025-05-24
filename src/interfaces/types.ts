export interface Parish {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  pastor?: string;
  massSchedule?: string;
  createdAt: Date;
  updatedAt: Date;
  fundraisingGoals?: FundraisingGoal[];
  payments?: Payment[];
}

export interface FundraisingGoal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  parishId: string;
  parish?: Parish;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  donorName?: string;
  donorEmail?: string;
  message?: string;
  isAnonymous: boolean;
  status: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
  parishId: string;
  parish?: Parish;
  fundraisingGoalId?: string;
  fundraisingGoal?: FundraisingGoal;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

// Legacy interface for backward compatibility
export interface Parafia {
  id: string;
  nazwa: string;
  adres: string;
  miasto: string;
  lat: number;
  lng: number;
  telefon?: string;
  email?: string;
  strona?: string;
  opis?: string;
  proboszcz?: string;
  godzinyMszy?: string;
}

// Helper function to convert Parish to Parafia for backward compatibility
export function parishToParafia(parish: Parish): Parafia {
  return {
    id: parish.id,
    nazwa: parish.name,
    adres: parish.address,
    miasto: parish.city,
    lat: parish.latitude,
    lng: parish.longitude,
    telefon: parish.phone,
    email: parish.email,
    strona: parish.website,
    opis: parish.description,
    proboszcz: parish.pastor,
    godzinyMszy: parish.massSchedule
  };
}
