import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { environment } from '../../environment/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const userData = new FormData();
    userData.append('username', 'testuser');
    userData.append('email', 'test@example.com');
    userData.append('password', 'testpassword');
    const expectedResponse = { message: 'User registered successfully' };

    service.register(userData).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush(expectedResponse);
  });

  it('should log in a user', () => {
    const credentials = { email: 'test@example.com', password: 'testpassword' };
    const expectedResponse = { message: 'Login successful', token: 'abc123' };
    // Add missing properties to credentials to match UserLogin type
    const fullCredentials = { email: 'test@example.com', password: 'testpassword', role: 'user', rememberMe: false };

    service.login(fullCredentials).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(expectedResponse);
  });
});
