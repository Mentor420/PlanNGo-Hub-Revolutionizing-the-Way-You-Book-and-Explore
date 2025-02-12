import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTourDetailsComponent } from './admin-tour-details.component';

describe('AdminTourDetailsComponent', () => {
  let component: AdminTourDetailsComponent;
  let fixture: ComponentFixture<AdminTourDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTourDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminTourDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
