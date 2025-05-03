// 1:1:src/app/pages/register/register.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { environment } from '../../core/environment/environment';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let router: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [RegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.register on valid form submission', () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      dateOfBirth: '2000-01-01',
      phoneNumber: '01234567890',
      username: 'johndoe',
      email: 'john.doe@example.com',
      street: '123 Main St',
      city: 'Anytown',
      country: 'Egypt',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };
    component.registerForm.setValue(userData);

    component.submitForm();

    const req = httpMock.expectOne(`${environment.baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush({ message: 'User registered successfully' });

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not call AuthService.register on invalid form submission', () => {
    const invalidUserData = {
      firstName: 'J',
      lastName: 'D',
      gender: '',
      dateOfBirth: '',
      phoneNumber: '1234567890',
      username: 'j',
      email: 'invalid-email',
      street: '123',
      city: 'A',
      country: 'E',
      password: 'Pass123!',
      confirmPassword: 'Pass123!'
    };
    component.registerForm.setValue(invalidUserData);

    component.submitForm();

    const req = httpMock.expectNone(`${environment.baseUrl}/register`);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should show password mismatch error on password mismatch', () => {
    const mismatchUserData = {
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      dateOfBirth: '2000-01-01',
      phoneNumber: '01234567890',
      username: 'johndoe',
      email: 'john.doe@example.com',
      street: '123 Main St',
      city: 'Anytown',
      country: 'Egypt',
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!'
    };
    component.registerForm.setValue(mismatchUserData);

    expect(component.registerForm.valid).toBe(false);
    expect(component.registerForm.errors).toEqual({ mismatch: true });
  });
});