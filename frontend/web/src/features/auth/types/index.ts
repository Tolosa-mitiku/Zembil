import { UserRole } from '@/core/constants';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: {
    uid: string;
    email: string;
    name: string;
    role: UserRole;
    image?: string;
  };
  token: string;
}

