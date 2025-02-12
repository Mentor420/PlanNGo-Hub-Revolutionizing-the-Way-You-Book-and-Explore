import { CanActivateFn, Router } from '@angular/router';

export const roleGuardGuard: CanActivateFn = (route, state) => {
  const router = new Router();

  const role = sessionStorage.getItem('role');

  if (!role) {
    router.navigate(['/login']);
    return false;
  }

  if (state.url.startsWith('/admin') && role === 'Admin') {
    return true;
  } else if (!state.url.startsWith('/admin') && role === 'Customer') {
    return true;
  }

  router.navigate(['/not-found']);
  return false;
};
