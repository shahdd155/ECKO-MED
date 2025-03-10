import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentinteractionComponent } from './departmentinteraction.component';

describe('DepartmentinteractionComponent', () => {
  let component: DepartmentinteractionComponent;
  let fixture: ComponentFixture<DepartmentinteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentinteractionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentinteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
