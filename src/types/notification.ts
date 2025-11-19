export type NotificationType = 'security_score' | 'threat' | 'key_warning';
export type NotificationSeverity = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  deviceId: string;
  message: string;
  timestamp: string;
  read: boolean;
}
