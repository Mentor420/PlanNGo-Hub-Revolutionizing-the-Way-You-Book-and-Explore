import { TestBed } from '@angular/core/testing';

import { ManageFlightsService } from './manage-flights.service';

describe('ManageFlightsService', () => {
  let service: ManageFlightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageFlightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
