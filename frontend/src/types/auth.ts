export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

// This matches your Login input
export interface LoginCredentials {
  email: string;
  password: string;
}

// This matches your Register input
export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}