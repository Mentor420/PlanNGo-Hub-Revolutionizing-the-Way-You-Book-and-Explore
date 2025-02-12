import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtmFormComponent } from './ctm-form.component';

describe('CtmFormComponent', () => {
  let component: CtmFormComponent;
  let fixture: ComponentFixture<CtmFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtmFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CtmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
