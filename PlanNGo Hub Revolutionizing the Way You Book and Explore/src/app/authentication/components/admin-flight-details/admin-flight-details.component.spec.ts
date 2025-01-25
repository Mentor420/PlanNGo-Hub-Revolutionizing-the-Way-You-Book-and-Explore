import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFlightDetailsComponent } from './admin-flight-details.component';

describe('AdminFlightDetailsComponent', () => {
  let component: AdminFlightDetailsComponent;
  let fixture: ComponentFixture<AdminFlightDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFlightDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminFlightDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
