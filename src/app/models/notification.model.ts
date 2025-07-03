export interface Notification {
  id: number;
  text: string;
  createdAt: string; // or Date if you want to parse it
  isRead: boolean;
  type: string;
}

export interface NotificationsResponse {
  total: number;
  unread: number;
  notifications: Notification[];
} 