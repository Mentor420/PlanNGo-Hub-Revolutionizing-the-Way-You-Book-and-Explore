import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightServiceComponent } from './flight-service.component';

describe('FlightServiceComponent', () => {
  let component: FlightServiceComponent;
  let fixture: ComponentFixture<FlightServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlightServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
