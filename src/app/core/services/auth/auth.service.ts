import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient) { }
  private readonly router= inject(Router);


  // sendSignupForm(formData:object):Observable<any>{

  //    return this.httpClient.post(`${environment.baseUrl}`)  
  //   // da el api bta3 el signup el hn5do mn backend 
  //     }
    
    
    //   sendLoginForm(formData:object):Observable<any>{
    //     return this.httpClient.post(`${environment.baseUrl}`)
    // //brdo el api mn backend
    //       }


  
}
