import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRoomComponent } from './hotel-room.component';

describe('HotelRoomComponent', () => {
  let component: HotelRoomComponent;
  let fixture: ComponentFixture<HotelRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelRoomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HotelRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
