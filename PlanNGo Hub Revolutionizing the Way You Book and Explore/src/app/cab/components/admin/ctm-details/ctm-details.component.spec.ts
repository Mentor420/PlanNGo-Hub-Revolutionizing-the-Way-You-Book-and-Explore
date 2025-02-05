import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtmDetailsComponent } from './ctm-details.component';

describe('CtmDetailsComponent', () => {
  let component: CtmDetailsComponent;
  let fixture: ComponentFixture<CtmDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtmDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CtmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
