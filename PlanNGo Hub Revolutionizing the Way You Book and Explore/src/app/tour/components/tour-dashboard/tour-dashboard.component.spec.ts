import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDashboardComponent } from './tour-dashboard.component';

describe('TourDashboardComponent', () => {
  let component: TourDashboardComponent;
  let fixture: ComponentFixture<TourDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TourDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
