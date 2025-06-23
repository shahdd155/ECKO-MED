import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyvisitsComponent } from './myvisits.component';

describe('MyvisitsComponent', () => {
  let component: MyvisitsComponent;
  let fixture: ComponentFixture<MyvisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyvisitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyvisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
