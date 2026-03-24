const CACHE_NAME = 'helpefy-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  const title = data.title || 'Helpefy';
  const options = {
    body: data.body || 'Du hast eine neue Nachricht',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/dashboard' },
    actions: [
      { action: 'open', title: 'Öffnen' },
      { action: 'close', title: 'Schließen' }
    ]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'close') return;
  const url = e.notification.data?.url || '/dashboard';
  e.waitUntil(clients.matchAll({type:'window'}).then(clientList => {
    for (const client of clientList) {
      if (client.url.includes('helpefy.de') && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) return clients.openWindow('https://helpefy.de' + url);
  }));
});
