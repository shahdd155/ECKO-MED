import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { Visit, Prescription, Scan } from '../../../models/patient-record.model';
import { LabTest } from '../../../models/lab-test.model';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private apiUrl = environment.apiUrl + '/api/public';

  constructor(private httpClient: HttpClient) {}

  getVisits(userId: string): Observable<Visit[]> {
    const params = new HttpParams().set('userId', userId);
    return this.httpClient.get<Visit[]>(`${this.apiUrl}/get-records`, { params, withCredentials: true });
  }

  getPrescriptions(visitId: number, userId: string): Observable<Prescription[]> {
    const params = new HttpParams().set('Id', visitId.toString()).set('userId', userId);
    return this.httpClient.get<Prescription[]>(`${this.apiUrl}/prescription`, { params, withCredentials: true });
  }

  getScans(visitId: number, userId: string): Observable<Scan[]> {
    const params = new HttpParams().set('Id', visitId.toString()).set('userId', userId);
    return this.httpClient.get<Scan[]>(`${this.apiUrl}/scans`, { params, withCredentials: true });
  }

  getLabTests(visitId: number, userId: string): Observable<LabTest[]> {
    const params = new HttpParams().set('Id', visitId.toString()).set('userId', userId);
    return this.httpClient.get<LabTest[]>(`${this.apiUrl}/labtests`, { params, withCredentials: true });
  }
}
