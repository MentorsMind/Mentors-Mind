export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  const permission = await Notification.requestPermission();
  return permission;
}

export function sendBrowserNotification(title: string, body: string, icon?: string) {
  if (!('Notification' in window)) {
    return;
  }
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/vite.svg',
    });
  }
}

export function getNotificationPermission(): NotificationPermission | undefined {
  if (!('Notification' in window)) {
    return undefined;
  }
  return Notification.permission;
}
