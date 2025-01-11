import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabDetailsPopupComponent } from './CabDetailsPopupComponent';

describe('CabDetailsPopupComponent', () => {
  let component: CabDetailsPopupComponent;
  let fixture: ComponentFixture<CabDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabDetailsPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CabDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
