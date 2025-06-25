import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Notification } from '../../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<Notification[]>([
    {
      id: '1',
      title: 'Appointment Reminder',
      message: 'You have an appointment tomorrow at 10:00 AM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: false
    },
    {
      id: '2',
      title: 'Lab Results Ready',
      message: 'Your recent lab results are now available.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false
    },
    {
      id: '3',
      title: 'Prescription Update',
      message: 'Your prescription has been updated by your doctor.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: true
    },
    {
      id: '4',
      title: 'New Message',
      message: 'You have received a new message from your provider.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      read: false
    },
    {
      id: '5',
      title: 'Billing Notice',
      message: 'Your latest bill is now available.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: true
    }
  ]);

  getNotificationsSignal() {
    return this.notificationsSignal;
  }

  markAsRead(notificationId: string): void {
    const updated = this.notificationsSignal().map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notificationsSignal.set(updated);
  }

  markAllAsRead(): void {
    const updated = this.notificationsSignal().map(n => ({ ...n, read: true }));
    this.notificationsSignal.set(updated);
  }
} 