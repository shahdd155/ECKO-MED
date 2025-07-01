import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyHelpcenterComponent } from './pharmacy-helpcenter.component';

describe('PharmacyHelpcenterComponent', () => {
  let component: PharmacyHelpcenterComponent;
  let fixture: ComponentFixture<PharmacyHelpcenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyHelpcenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyHelpcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
