import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelDashboardComponent } from './hotel-dashboard.component';

describe('HotelDashboardComponent', () => {
  let component: HotelDashboardComponent;
  let fixture: ComponentFixture<HotelDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HotelDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
