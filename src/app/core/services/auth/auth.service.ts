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
    return this.httpClient.get<boolean>(`${this.baseUrl}/is-authenticated`, { withCredentials: true }).pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          return this.fetchUserProfile().pipe(map(() => true));
        }
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
  loginuser(credentials: UserLogin): Observable<AuthResponse> {
    const loginPayload = { ...credentials};
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/userlogin`, loginPayload, { withCredentials: true }).pipe(
      switchMap(response => {
        return this.fetchUserProfile().pipe(
          map(() => {
            this.router.navigate(['/patientdashboard']); // Redirect to patient dashboard
            return response;
          })
        );
      })
    );
  }
  loginPharmacy(credentials: UserLogin): Observable<AuthResponse> {
    const loginPayload = { ...credentials };
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/pharmacylogin`, loginPayload, { withCredentials: true }).pipe(
      switchMap(response => {
        return this.fetchUserProfile().pipe(
          map(() => {
            this.router.navigate(['/viewrequests']); // Redirect to pharmacy dashboard
            return response;
          })
        );
      })
    );
  }
  loginDataEntry(credentials: UserLogin): Observable<AuthResponse> {
    const loginPayload = { ...credentials};
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/dataentrylogin`, loginPayload, { withCredentials: true }).pipe(
      switchMap(response => {
        return this.fetchUserProfile().pipe(
          map(() => {
            this.router.navigate(['/dEntrydashboard']); // Redirect to data entry dashboard
            return response;
          })
        );
      })
    );
  }

  // LOGOUT
  logout(): void {
    this.httpClient.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).subscribe({
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
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/user-register`, userData, { withCredentials: true });
  }

  // PASSWORD RECOVERY
  forgotPassword(email: string): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/forgot-password`, { email }, { withCredentials: true });
  }

  resetPassword(data: ResetPasswordViewModel): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/reset-password`, data, { withCredentials: true });
  }

  // EMAIL CONFIRMATION (called from a component handling the link)
  confirmEmail(userId: string, token: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/confirm-email`, { params: { userId, token }, withCredentials: true });
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
}