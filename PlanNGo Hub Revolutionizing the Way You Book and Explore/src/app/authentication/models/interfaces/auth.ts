export interface RegisterPostData {
  fullName: string;
  email: string;
  password: string;
}

// export interface User extends RegisterPostData {
//   id: string;
// }
export interface User extends RegisterPostData {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: string; // Add this property
  gender: string;
  age: number;
}

export interface Provider extends RegisterPostData {
  fullName: string;
  email: string;
  password: string;
  role: string; // Add this property
  gender: string;
  age: number;
  type: string;
}