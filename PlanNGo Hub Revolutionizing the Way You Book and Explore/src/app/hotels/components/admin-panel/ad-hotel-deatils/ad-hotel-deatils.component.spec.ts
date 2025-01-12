import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdHotelDeatilsComponent } from './ad-hotel-deatils.component';

describe('AdHotelDeatilsComponent', () => {
  let component: AdHotelDeatilsComponent;
  let fixture: ComponentFixture<AdHotelDeatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdHotelDeatilsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdHotelDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
