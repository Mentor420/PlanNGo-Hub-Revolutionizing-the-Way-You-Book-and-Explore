import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServiceComponent } from './edit-service.component';

describe('EditServiceComponent', () => {
  let component: EditServiceComponent;
  let fixture: ComponentFixture<EditServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
