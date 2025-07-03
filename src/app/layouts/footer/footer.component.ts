import { Component, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  notifications$ = this.notificationService.getNotifications();
  showDropdown = false;

  getUserType(): 'patient' | 'dataEntry' | 'pharmacy' {
    const url = this.router.url;
    if (
      url.includes('dEntrydashboard') ||
      url.includes('addpatient') ||
      url.includes('dentryprofile') ||
      url.includes('departmentinteraction') ||
      url.includes('patientinteraction') ||
      url.includes('dentry-helpcenter')
    ) {
      return 'dataEntry';
    }
    if (url.includes('viewrequests') || url.includes('managerequests') || url.includes('pharmacy-helpcenter')) {
      return 'pharmacy';
    }
    return 'patient';
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe();
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  trackById(index: number, notification: Notification): number {
    return notification.id;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-dropdown-container')) {
      this.closeDropdown();
    }
  }
}
