import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private httpClient:HttpClient) { }
  private readonly router= inject(Router);

  getProfileData(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/Profile`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/Profile`, profileData);
  }

  updateProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${this.apiUrl}/UpdateProfileImage`, formData);
  }

  getDashboardData(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/dashboardData`);
  }

  getVisits(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/get-records`);
  }

  getPrescriptions(visitId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/prescription`, { params: { Id: visitId.toString() } });
  }

  getScans(visitId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/scans`, { params: { Id: visitId.toString() } });
  }

  searchHospitals(searchParams: any): Observable<any> {
    let params = new HttpParams();
    if (searchParams.Deptype) params = params.append('Deptype', searchParams.Deptype);
    if (searchParams.Insurance) params = params.append('Insurance', searchParams.Insurance);
    if (searchParams.Name) params = params.append('Name', searchParams.Name);
    if (searchParams.Budget) params = params.append('Budget', searchParams.Budget);
    if (searchParams.Distance) params = params.append('Distance', searchParams.Distance);
    if (searchParams.Lat) params = params.append('Lat', searchParams.Lat);
    if (searchParams.Lang) params = params.append('Lang', searchParams.Lang);

    return this.httpClient.get(`${this.apiUrl}/hospitalsearch`, { params });
  }
}
