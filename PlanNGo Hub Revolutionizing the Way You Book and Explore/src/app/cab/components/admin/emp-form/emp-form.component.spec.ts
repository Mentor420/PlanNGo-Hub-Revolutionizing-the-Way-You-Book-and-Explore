import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpFormComponent } from './emp-form.component';

describe('EmpFormComponent', () => {
  let component: EmpFormComponent;
  let fixture: ComponentFixture<EmpFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
