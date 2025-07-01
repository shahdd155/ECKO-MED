import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';

interface ChartSeries {
  name: string;
  value: number;
}

interface ChartData {
  name: string;
  series: ChartSeries[];
}

interface GenderStats {
  male: number;
  female: number;
}

interface DashboardData {
  userName: string;
  totalPatients: number;
  totalLabResults: number;
  patientOverviewData: ChartData[];
  genderStats: GenderStats;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard/data-entry`)
      .pipe(
        catchError(error => {
          console.error('Error fetching dashboard data:', error);
          // Fallback to mocked data if API fails
          return this.getMockedData();
        })
      );
  }

  private getMockedData(): Observable<DashboardData> {
    // Mocked data structure as fallback
    return of({
      userName: 'John Mark',
      totalPatients: 1834,
      totalLabResults: 460,
      patientOverviewData: [
        {
          name: 'Patients Number This Month',
          series: [
            { name: 'Sat', value: 12000 },
            { name: 'Sun', value: 15000 },
            { name: 'Mon', value: 20000 },
            { name: 'Tue', value: 30858 },
            { name: 'Wed', value: 25000 },
            { name: 'Thu', value: 18000 },
            { name: 'Fri', value: 17000 }
          ]
        },
        {
          name: 'Patients Number Last Month',
          series: [
            { name: 'Sat', value: 9000 },
            { name: 'Sun', value: 11000 },
            { name: 'Mon', value: 14000 },
            { name: 'Tue', value: 17000 },
            { name: 'Wed', value: 16000 },
            { name: 'Thu', value: 15000 },
            { name: 'Fri', value: 17000 }
          ]
        }
      ],
      genderStats: {
        male: 18454,
        female: 4500
      }
    }).pipe(delay(1000)); 
  }
} 