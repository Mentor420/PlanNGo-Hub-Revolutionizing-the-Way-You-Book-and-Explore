import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanNGoComponent } from './planngo.component';

describe('PlanNGoComponent', () => {
  let component: PlanNGoComponent;
  let fixture: ComponentFixture<PlanNGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanNGoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanNGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
