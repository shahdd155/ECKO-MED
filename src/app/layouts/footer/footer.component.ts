import { Component, inject, input, signal, computed, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  
  isLogin = input<boolean>(true);
  isPatient = input<boolean>(true);
  isdataEntry = input<boolean>(false);

  notifications = this.notificationService.getNotificationsSignal();
  showDropdown = signal<boolean>(false);
  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  getUserType(): 'patient' | 'dataEntry' {
    if (this.isPatient()) {
      return 'patient';
    } else if(this.isdataEntry()) {
      return 'dataEntry';
    }
    return 'patient'; 
  }

  toggleDropdown(): void {
    this.showDropdown.update(current => !current);
  }

  closeDropdown(): void {
    this.showDropdown.set(false);
  }

  getRecentNotifications(): Notification[] {
    return this.notifications().slice(0, 5);
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-dropdown-container')) {
      this.closeDropdown();
    }
  }
}
