import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDashboardComponent } from './flight-dashboard.component';

describe('FlightDashboardComponent', () => {
  let component: FlightDashboardComponent;
  let fixture: ComponentFixture<FlightDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlightDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
