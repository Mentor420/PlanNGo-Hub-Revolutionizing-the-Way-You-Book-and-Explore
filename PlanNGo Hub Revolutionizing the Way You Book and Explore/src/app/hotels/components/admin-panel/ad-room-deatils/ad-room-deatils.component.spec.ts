import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdRoomDeatilsComponent } from './ad-room-deatils.component';

describe('AdRoomDeatilsComponent', () => {
  let component: AdRoomDeatilsComponent;
  let fixture: ComponentFixture<AdRoomDeatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdRoomDeatilsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdRoomDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
