import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-allnotifications',
  imports: [CommonModule],
  templateUrl: './allnotifications.component.html',
  styleUrl: './allnotifications.component.scss'
})
export class AllnotificationsComponent {
  private readonly notificationService = inject(NotificationService);
  notifications = this.notificationService.getNotificationsSignal();
  loading = computed(() => false);

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    
    return timestamp.toLocaleDateString();
  }

  getUnreadCount(): number {
    return this.notifications().filter(n => !n.read).length;
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }
}
