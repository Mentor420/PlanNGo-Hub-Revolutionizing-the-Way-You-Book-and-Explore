import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSimilarFlightsComponent } from './view-similar-flights.component';

describe('ViewSimilarFlightsComponent', () => {
  let component: ViewSimilarFlightsComponent;
  let fixture: ComponentFixture<ViewSimilarFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSimilarFlightsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSimilarFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
