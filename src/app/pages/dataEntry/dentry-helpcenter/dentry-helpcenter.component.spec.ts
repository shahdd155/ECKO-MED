import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentryHelpcenterComponent } from './dentry-helpcenter.component';

describe('DentryHelpcenterComponent', () => {
  let component: DentryHelpcenterComponent;
  let fixture: ComponentFixture<DentryHelpcenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentryHelpcenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DentryHelpcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
