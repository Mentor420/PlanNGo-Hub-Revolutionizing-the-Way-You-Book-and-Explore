import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPlanComponent } from './tour-plan.component';

describe('TourPlanComponent', () => {
  let component: TourPlanComponent;
  let fixture: ComponentFixture<TourPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TourPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
