export interface RegisterPostData {
  id?: string; // Optional during registration
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  gender: string;
  age: number;
  role: string;
  serviceType?: string | null; // Allow null for Customers
}

export interface User extends RegisterPostData {
  id: string; // Ensure 'id' is present for User data
  role: string;
  profileImage?: string; // Add optional profile image property
}

export const DEFAULT_PROFILE_IMAGE = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

