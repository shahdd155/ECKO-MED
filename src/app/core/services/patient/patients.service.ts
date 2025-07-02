import { HttpClient, HttpParams } from '@angular/common/http';
import {Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { Visit, Prescription, Scan } from '../../../models/patient-record.model';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private httpClient:HttpClient) { }
  getProfileData(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/Profile`, { withCredentials: true });
  }

  updateProfile(profileData: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/Profile`, profileData, { withCredentials: true });
  }

  updateProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${this.apiUrl}/UpdateProfileImage`, formData, { withCredentials: true });
  }

  getDashboardData(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/dashboardData`, { withCredentials: true });
  }

  getVisits(): Observable<Visit[]> {
    return this.httpClient.get<Visit[]>(`${this.apiUrl}/get-records`, { withCredentials: true });
  }

  getPrescriptions(visitId: number): Observable<Prescription[]> {
    return this.httpClient.get<Prescription[]>(`${this.apiUrl}/prescription`, { params: { Id: visitId.toString() }, withCredentials: true });
  }

  getScans(visitId: number): Observable<Scan[]> {
    return this.httpClient.get<Scan[]>(`${this.apiUrl}/scans`, { params: { Id: visitId.toString() }, withCredentials: true });
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

    return this.httpClient.get(`${this.apiUrl}/hospitalsearch`, { params, withCredentials: true });
  }
}
