export interface RegisterPostData {
  fullName: string;
  email: string;
  password: string;
  gender: string;  // Add gender property
  age: number;
}

export interface User extends RegisterPostData {
  fullName: string;
  email: string;
  password: string;
  gender: string;
  age: number;
  picture?: string;
}
