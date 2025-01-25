import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCabDetailsComponent } from './admin-cab-details.component';

describe('AdminCabDetailsComponent', () => {
  let component: AdminCabDetailsComponent;
  let fixture: ComponentFixture<AdminCabDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCabDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCabDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
