import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Notification , NotificationsResponse} from '../../models/notification.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl+"/user";

  constructor(private httpClient: HttpClient) {}


  markAsRead(id: number): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/Mark-notification-as-read`, { id }, { withCredentials: true });
  }

  markAllAsRead(): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/Mark-all-notifications-as-rea`, {}, { withCredentials: true });
  }




  getNotifications(): Observable<NotificationsResponse> {
    return this.httpClient.get<NotificationsResponse>(`${this.apiUrl}/Notifications`, { withCredentials: true });
  }
} 