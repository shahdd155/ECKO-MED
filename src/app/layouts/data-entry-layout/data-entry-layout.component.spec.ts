import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryLayoutComponent } from './data-entry-layout.component';

describe('DataEntryLayoutComponent', () => {
  let component: DataEntryLayoutComponent;
  let fixture: ComponentFixture<DataEntryLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataEntryLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataEntryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
