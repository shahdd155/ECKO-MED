import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdashboardComponent } from './pdashboard.component';

describe('PdashboardComponent', () => {
  let component: PdashboardComponent;
  let fixture: ComponentFixture<PdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
