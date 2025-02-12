import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHotelDetailsComponent } from './admin-hotel-details.component';

describe('AdminHotelDetailsComponent', () => {
  let component: AdminHotelDetailsComponent;
  let fixture: ComponentFixture<AdminHotelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHotelDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminHotelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
