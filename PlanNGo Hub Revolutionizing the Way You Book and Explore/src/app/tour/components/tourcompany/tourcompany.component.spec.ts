import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourcompanyComponent } from './tourcompany.component';

describe('TourcompanyComponent', () => {
  let component: TourcompanyComponent;
  let fixture: ComponentFixture<TourcompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourcompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TourcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
