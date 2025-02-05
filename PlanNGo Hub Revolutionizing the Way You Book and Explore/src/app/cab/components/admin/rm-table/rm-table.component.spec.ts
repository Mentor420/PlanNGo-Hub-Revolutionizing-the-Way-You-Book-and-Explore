import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmTableComponent } from './rm-table.component';

describe('RmTableComponent', () => {
  let component: RmTableComponent;
  let fixture: ComponentFixture<RmTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RmTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RmTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
