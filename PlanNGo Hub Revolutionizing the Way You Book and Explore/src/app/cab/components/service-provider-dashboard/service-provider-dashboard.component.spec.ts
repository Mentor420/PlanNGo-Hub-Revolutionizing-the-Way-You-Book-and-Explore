import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderDashboardComponent } from './service-provider-dashboard.component';

describe('ServiceProviderDashboardComponent', () => {
  let component: ServiceProviderDashboardComponent;
  let fixture: ComponentFixture<ServiceProviderDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceProviderDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceProviderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
