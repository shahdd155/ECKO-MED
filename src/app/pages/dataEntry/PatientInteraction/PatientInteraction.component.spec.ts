import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientInteractionComponent } from './PatientInteraction.component';

describe('PatientInteractionComponent', () => {
  let component: PatientInteractionComponent;
  let fixture: ComponentFixture<PatientInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientInteractionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
