import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceHotelComponent } from './s-hotel.component';

describe('ServiceHotelComponent', () => {
  let component: ServiceHotelComponent;
  let fixture: ComponentFixture<ServiceHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceHotelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
