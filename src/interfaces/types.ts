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
  bankAccount?: string;  // Numer konta bankowego
  uniqueSlug?: string;   // Unikalny URL slug
  photoUrl?: string;     // URL zdjęcia parafii
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
