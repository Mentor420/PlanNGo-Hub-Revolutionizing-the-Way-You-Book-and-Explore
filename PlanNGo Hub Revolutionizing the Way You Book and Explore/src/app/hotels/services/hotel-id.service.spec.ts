import { TestBed } from '@angular/core/testing';

import { HotelIdService } from './hotel-id.service';

describe('HotelIdService', () => {
  let service: HotelIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
