import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcompanyComponent } from './showcompany.component';

describe('ShowcompanyComponent', () => {
  let component: ShowcompanyComponent;
  let fixture: ComponentFixture<ShowcompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
