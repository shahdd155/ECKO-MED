import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchmedicineComponent } from './searchmedicine.component';

describe('SearchmedicineComponent', () => {
  let component: SearchmedicineComponent;
  let fixture: ComponentFixture<SearchmedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchmedicineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchmedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
