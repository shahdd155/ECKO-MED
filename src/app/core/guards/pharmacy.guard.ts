import { CanActivateFn } from '@angular/router';

export const pharmacyGuard: CanActivateFn = (route, state) => {
  return true;
};
