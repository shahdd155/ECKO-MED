import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const dataEntryGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      router.navigate(['/login']);
      return false;
    }
    if (role !== 'data-entry') {
      router.navigate(['/notfound']);
      return false;
    }
    return true;
  } else {
    return true;
  }
};
