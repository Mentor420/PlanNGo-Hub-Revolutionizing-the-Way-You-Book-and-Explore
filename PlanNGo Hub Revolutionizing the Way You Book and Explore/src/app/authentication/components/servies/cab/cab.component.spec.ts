import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabComponent } from './cab.component';

describe('CabComponent', () => {
  let component: CabComponent;
  let fixture: ComponentFixture<CabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
