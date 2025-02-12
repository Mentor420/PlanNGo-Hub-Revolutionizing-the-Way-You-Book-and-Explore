import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourServiceComponent } from './tour-service.component';

describe('TourServiceComponent', () => {
  let component: TourServiceComponent;
  let fixture: ComponentFixture<TourServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TourServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
