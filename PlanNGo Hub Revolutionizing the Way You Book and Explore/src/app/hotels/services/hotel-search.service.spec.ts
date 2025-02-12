import { TestBed } from '@angular/core/testing';

import { HotelSearchService } from './hotel-search.service';

describe('HotelSearchService', () => {
  let service: HotelSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
