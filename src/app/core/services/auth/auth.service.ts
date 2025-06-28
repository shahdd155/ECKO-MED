import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { User } from '../../../models/user.model';
import { jwtDecode } from 'jwt-decode';

// Interfaces for API responses
interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
  email?: string;
}

interface ValidationResponse {
  available: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private httpClient: HttpClient, @Inject(Router) private router: Router) {
    this.loadUserFromToken();
  }

  userData: any;

  // Function to log in a user
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${environment.baseUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('token', response.token); // Keep for backward compatibility
          if (response.user) {
            this.currentUserSubject.next(response.user);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  // Function to register a new user
  register(userData: User | FormData): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(`${environment.baseUrl}/register`, userData).pipe(
      tap(response => {
        if (response.success) {
          console.log('Registration successful:', response.message);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Validate username availability
  validateUsername(username: string): Observable<ValidationResponse> {
    return this.httpClient.get<ValidationResponse>(`${environment.baseUrl}/validate/username/${username}`).pipe(
      catchError(this.handleError)
    );
  }

  // Validate email availability
  validateEmail(email: string): Observable<ValidationResponse> {
    return this.httpClient.get<ValidationResponse>(`${environment.baseUrl}/validate/email/${email}`).pipe(
      catchError(this.handleError)
    );
  }

  // Validate phone number availability
  validatePhone(phoneNumber: string): Observable<ValidationResponse> {
    return this.httpClient.get<ValidationResponse>(`${environment.baseUrl}/validate/phone/${phoneNumber}`).pipe(
      catchError(this.handleError)
    );
  }

  // Function to check if a user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Error checking token validity:', error);
      this.logout();
      return false;
    }
  }

  // Function to log out a user
  logout(): void {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (token) {
      // Call the backend logout endpoint
      this.httpClient.post(`${environment.baseUrl}/logout`, {}).subscribe({
        next: () => {
          this.clearUserData();
        },
        error: (error) => {
          console.error('Logout error:', error);
          // Even if logout fails, clear local data
          this.clearUserData();
        }
      });
    } else {
      this.clearUserData();
    }
  }

  // Clear user data and navigate to login
  private clearUserData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    this.userData = null;
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Load user data from token
  private loadUserFromToken(): void {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token && this.isLoggedIn()) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userData = decodedToken;
        // You might want to fetch full user data from backend here
        console.log('User data loaded from token:', decodedToken);
      } catch (error) {
        console.error('Error loading user from token:', error);
        this.clearUserData();
      }
    }
  }

  // Get current user data
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  //-------------------to get the user id from the token----------------
  getUserData(): void {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      try {
        this.userData = jwtDecode(token);
        console.log('User data:', this.userData);
      } catch (error) {
        console.error('Error decoding token:', error);
        this.userData = null;
      }
    }
  }

  // Get user ID from token
  getUserId(): string | null {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.userId || decodedToken.sub || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  //-------------------to get the user type from the token----------------
  getUserType(): string | null {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.userType || decodedToken.role || null;
      }
      return null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Refresh user data from backend
  refreshUserData(): Observable<User> {
    return this.httpClient.get<User>(`${environment.baseUrl}/user/profile`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  // Update user profile
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.httpClient.put<User>(`${environment.baseUrl}/user/profile`, userData).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  // Change password
  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/user/change-password`, passwordData).pipe(
      catchError(this.handleError)
    );
  }

  setEmailVerify(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/forgot-Password`, data).pipe(
      catchError(this.handleError)
    );
  }

  setCodeVerify(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/verify-code`, data).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/reset-password`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Verify email
  verifyEmail(token: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/verify-email`, { token }).pipe(
      catchError(this.handleError)
    );
  }

  // Resend verification email
  resendVerificationEmail(email: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/resend-verification`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Invalid request data';
          break;
        case 401:
          errorMessage = 'Invalid credentials';
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 409:
          errorMessage = error.error?.message || 'Resource already exists';
          break;
        case 422:
          errorMessage = error.error?.message || 'Validation error';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = error.error?.message || `Server error: ${error.status}`;
      }
    }
    
    console.error('Auth service error:', error);
    return throwError(() => new Error(errorMessage));
  }
}