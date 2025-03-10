import { CanActivateFn } from '@angular/router';

export const dataEntryGuard: CanActivateFn = (route, state) => {
  return true;
};
