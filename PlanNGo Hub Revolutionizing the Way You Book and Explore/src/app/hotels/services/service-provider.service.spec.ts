import { TestBed } from '@angular/core/testing';

import { ServiceProviderService } from './service-provider.service';

describe('ServiceProviderService', () => {
  let service: ServiceProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
