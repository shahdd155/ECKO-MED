import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { User } from '../../../models/user.model';
import { UserLogin } from '../../../models/loginModels';

// Interfaces for API responses
interface AuthResponse {
  message: string;
  userName?: string; // For registration
}

interface ResetPasswordViewModel {
  email: string;
  token: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl + '/account';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.checkAuthenticationStatus().subscribe();
  }

  // Check authentication status on startup
  checkAuthenticationStatus(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/is-authenticated`).pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          return this.fetchUserProfile().pipe(map(() => true));
        }
        return of(false);
      }),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(false);
      })
    );
  }

  // Fetch the user profile from a dedicated endpoint
  private fetchUserProfile(): Observable<User> {
    // This assumes a general profile endpoint exists that returns the logged-in user's data.
    // This needs to be created in the backend.
    return this.httpClient.get<User>(`${environment.apiUrl}/user/profile`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  // LOGIN
  login(credentials: UserLogin): Observable<AuthResponse> {
    // Backend expects 'User' role, not 'patient'
    const loginPayload = { ...credentials, role: 'User' };
    
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/userlogin`, loginPayload).pipe(
      switchMap(response => {
        return this.fetchUserProfile().pipe(
          map(() => response) // Pass original login response
        );
      }),
      catchError(this.handleError)
    );
  }

  // LOGOUT
  logout(): void {
    this.httpClient.post(`${this.baseUrl}/logout`, {}).subscribe({
      next: () => this.clearLocalUserData(),
      error: () => this.clearLocalUserData()
    });
  }

  private clearLocalUserData(): void {
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // REGISTER
  register(userData: FormData): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/user-register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  // PASSWORD RECOVERY
  forgotPassword(email: string): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(data: ResetPasswordViewModel): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/reset-password`, data).pipe(
      catchError(this.handleError)
    );
  }

  // EMAIL CONFIRMATION (called from a component handling the link)
  confirmEmail(userId: string, token: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/confirm-email`, { params: { userId, token } });
  }

  // HELPERS
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserId(): string | undefined {
    return this.currentUserSubject.value?.id;
  }

  isLoggedIn(): Observable<boolean> {
     return this.currentUser$.pipe(map(user => !!user));
  }

  // ERROR HANDLER
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (typeof error.error === 'string' && error.error.length < 200) {
        errorMessage = error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.title) { // For validation errors
        errorMessage = error.error.title;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Invalid credentials or access denied.';
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = 'The requested resource was not found.';
            break;
          case 500:
            errorMessage = 'An unexpected server error occurred.';
            break;
          default:
            errorMessage = `An unexpected error occurred. Status: ${error.status}`;
        }
      }
    }
    
    console.error('Auth service error:', error);
    return throwError(() => new Error(errorMessage));
  }
}