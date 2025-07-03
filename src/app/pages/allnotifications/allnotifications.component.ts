import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { Notification, NotificationsResponse } from '../../models/notification.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-allnotifications',
  imports: [CommonModule],
  templateUrl: './allnotifications.component.html',
  styleUrl: './allnotifications.component.scss'
})
export class AllnotificationsComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);
  notifications$: Observable<NotificationsResponse>;
  loading = false;

  constructor() {
    this.notifications$ = this.notificationService.getNotifications();
  }

  ngOnInit(): void {
    this.notifications$ = this.notificationService.getNotifications();
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  }

  getUnreadCount(response: NotificationsResponse): number {
    return response.unread;
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe();
    this.notifications$ = this.notificationService.getNotifications();
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
    this.notifications$ = this.notificationService.getNotifications();
  }

  trackById(index: number, notification: Notification): number {
    return notification.id;
  }
}
