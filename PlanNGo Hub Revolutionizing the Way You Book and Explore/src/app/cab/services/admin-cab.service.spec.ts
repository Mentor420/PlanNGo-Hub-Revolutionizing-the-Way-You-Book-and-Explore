import { TestBed } from '@angular/core/testing';

import { AdminCabService } from './admin-cab.service';

describe('AdminCabService', () => {
  let service: AdminCabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
