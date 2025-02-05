import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderRegisterComponent } from './provider-register.component';

describe('ProviderRegisterComponent', () => {
  let component: ProviderRegisterComponent;
  let fixture: ComponentFixture<ProviderRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProviderRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
