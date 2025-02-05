import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFlightsComponent } from './admin-flights.component';

describe('AdminFlightsComponent', () => {
  let component: AdminFlightsComponent;
  let fixture: ComponentFixture<AdminFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFlightsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
