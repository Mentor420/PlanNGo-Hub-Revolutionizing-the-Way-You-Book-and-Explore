import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideManageComponent } from './ride-manage.component';

describe('RideManageComponent', () => {
  let component: RideManageComponent;
  let fixture: ComponentFixture<RideManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RideManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
