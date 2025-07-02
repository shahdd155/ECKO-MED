import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const dataEntryGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    const role = localStorage.getItem('role');
    if (role !== 'data-entry') {
      router.navigate(['/login']);
      return false;
    }
    return true;
  } else {
    return true;
  }
};
