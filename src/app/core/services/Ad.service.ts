import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ad } from '../../models/Ad';
import { environment } from '../../core/environment/environment';

@Injectable({ providedIn: 'root' })
export class AdsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAds(): Observable<Ad[]> {
    return this.http.get<Ad[]>(`${this.apiUrl}/Get-Ads`, { withCredentials: true });
  }
}
