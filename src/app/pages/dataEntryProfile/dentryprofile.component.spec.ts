import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentryprofileComponent } from './dentryprofile.component';

describe('DentryprofileComponent', () => {
  let component: DentryprofileComponent;
  let fixture: ComponentFixture<DentryprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentryprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DentryprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
