import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabtestsComponent } from './labtests.component';

describe('LabtestsComponent', () => {
  let component: LabtestsComponent;
  let fixture: ComponentFixture<LabtestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabtestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabtestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
