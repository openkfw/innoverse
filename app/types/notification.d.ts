interface Notification {
  userId: string;
  type: 'email' | 'push';
}

export interface PushNotification extends Notification {
  title: string;
  body: string;
  icon: string;
  topic: string;
  urgency?: 'normal' | 'very-low' | 'low' | 'high';
  ttl?: number;
  url?: string;
}

export interface EmailNotification extends Notification {
  subject: string;
  body: string;
}
