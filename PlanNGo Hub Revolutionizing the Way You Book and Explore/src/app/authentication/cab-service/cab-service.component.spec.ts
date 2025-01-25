import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabServiceComponent } from './cab-service.component';

describe('CabServiceComponent', () => {
  let component: CabServiceComponent;
  let fixture: ComponentFixture<CabServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CabServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
