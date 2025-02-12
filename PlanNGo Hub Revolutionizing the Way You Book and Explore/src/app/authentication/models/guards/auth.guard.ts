import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const ServiceAuthGuard: CanActivateFn = (route, state) => {
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');  // Get the stored role from sessionStorage

  // Ensure the user is logged in and that the role matches the required role for the route
  if (email && role=='Service Provider') {
    if (route.data['role'] && route.data['role'] !== role) {
      const router = inject(Router);
      router.navigate(['home']);  // Redirect if the role doesn't match the required one
      return false;
    }
    return true;
  } else {
    const router = inject(Router);
    alert("Wrong Route Check permissions")
    router.navigate(['login']);
    return false;  // Redirect to login if no email or role found
  }
};


export const AdminAuthGuard: CanActivateFn = (route, state) => {
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');  // Get the stored role from sessionStorage

  // Ensure the user is logged in and that the role matches the required role for the route
  if (email && role=='Admin') {
    if (route.data['role'] && route.data['role'] !== role) {
      const router = inject(Router);
      router.navigate(['home']);  // Redirect if the role doesn't match the required one
      return false;
    }
    return true;
  } else {
    const router = inject(Router);
    alert("Wrong Route Check permissions")
    router.navigate(['login']);
    return false;  // Redirect to login if no email or role found
  }
};

export const authGuard: CanActivateFn = (route, state) => {
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');  // Get the stored role from sessionStorage

  // Ensure the user is logged in and that the role matches the required role for the route
  if (email && role=='Customer') {
    if (route.data['role'] && route.data['role'] !== role) {
      const router = inject(Router);
      router.navigate(['home']);  // Redirect if the role doesn't match the required one
      return false;
    }
    return true;
  } else {
    alert("Wrong Route Check permissions")
    const router = inject(Router);
    router.navigate(['login']);
    return false;  // Redirect to login if no email or role found
  }
};
