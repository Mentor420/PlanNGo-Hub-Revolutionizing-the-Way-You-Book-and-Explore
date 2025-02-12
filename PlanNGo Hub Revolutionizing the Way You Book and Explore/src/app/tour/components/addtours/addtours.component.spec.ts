import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtoursComponent } from './addtours.component';

describe('AddtoursComponent', () => {
  let component: AddtoursComponent;
  let fixture: ComponentFixture<AddtoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddtoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddtoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
