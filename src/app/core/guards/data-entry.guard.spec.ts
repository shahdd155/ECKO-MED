import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dataEntryGuard } from './data-entry.guard';

describe('dataEntryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dataEntryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
