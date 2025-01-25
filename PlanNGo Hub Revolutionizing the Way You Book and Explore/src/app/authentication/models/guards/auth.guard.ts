import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  console.log('UserId from auth guard:', sessionStorage.getItem('userId'));
  if (sessionStorage.getItem('userId')) {
    return true; // Allow access to the route
  } else {
    router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    return false; // Deny access
  }
};