import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBookingHistoryComponent } from './booking-history.component';

describe('BookingHistoryComponent', () => {
  let component: FlightBookingHistoryComponent;
  let fixture: ComponentFixture<FlightBookingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightBookingHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlightBookingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
