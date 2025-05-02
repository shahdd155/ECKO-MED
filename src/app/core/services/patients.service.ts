import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(private httpClient:HttpClient) { }
    private readonly router= inject(Router);
}
