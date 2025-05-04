import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, @Inject(Router) private router: Router) {}

  // Function to register a new user
  register(userData: User): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/register`, userData);
  }

  // Function to log in a user
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/login`, credentials);
  }
  
  // Function to check if a user is logged in
  isLoggedIn(): boolean {
    // Check if a token is present in local storage
    return !!localStorage.getItem('authToken');
  }

  // Function to log out a user
  logout(): void {
    // Remove the token from local storage
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
