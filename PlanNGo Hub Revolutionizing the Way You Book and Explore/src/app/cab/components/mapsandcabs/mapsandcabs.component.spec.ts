import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapsandcabsComponent } from './mapsandcabs.component';

describe('MapsandcabsComponent', () => {
  let component: MapsandcabsComponent;
  let fixture: ComponentFixture<MapsandcabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapsandcabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapsandcabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
