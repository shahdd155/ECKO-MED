import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentrydashboardComponent } from './dentrydashboard.component';

describe('DentrydashboardComponent', () => {
  let component: DentrydashboardComponent;
  let fixture: ComponentFixture<DentrydashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentrydashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DentrydashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
