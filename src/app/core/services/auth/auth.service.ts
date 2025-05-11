import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { User } from '../../../models/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, @Inject(Router) private router: Router) {}
  userData:any;

  // Function to log in a user
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/login`, credentials);
  }


  // Function to register a new user
  register(userData: User): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/register`, userData);
  }

  // Function to check if a user is logged in
  isLoggedIn(): boolean {
    // Check if a token is present in local storage
    return !!localStorage.getItem('authToken');
  }

  // Function to log out a user
  logout(): void {
    // Call the backend logout endpoint
    this.httpClient.post(`${environment.baseUrl}/logout`, {}).subscribe({
      next: () => {
        // Remove the token from local storage
        localStorage.removeItem('authToken');
        this.userData = null;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Handle the error appropriately
      }
    });
  }

  //-------------------to get the user id from the token----------------
    getUserData():void{
    this.userData= jwtDecode(localStorage.getItem('token')!)
    console.log(this.userData)
  }


  setEmailVerify(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/forgot-Password`,data)
  } //de lel email yt2kd mno

  setCodeVerify(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/verify-code`,data) //de yt2kd mn el code
  }

  resetPassword(data:object):Observable<any>{
    return this.httpClient.put(`${environment.baseUrl}/reset-password`,data) //de b2a ny3'yr el pass 
  }


}