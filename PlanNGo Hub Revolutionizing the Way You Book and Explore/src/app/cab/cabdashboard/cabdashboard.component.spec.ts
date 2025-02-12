import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabdashboardComponent } from './cabdashboard.component';
import {CabHistoryComponent} from './cab-history.component';
describe('CabdashboardComponent', () => {
  let component: CabdashboardComponent;
  let fixture: ComponentFixture<CabdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabdashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CabdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
