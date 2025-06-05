self.addEventListener('push', function (event) {
  // console.log('Push reçu:', event)

  try {
    const data = event.data?.json()
    // console.log('Payload push:', data)

    const options = {
      body: data.body || '',
      icon: '/favicon/web-app-manifest-192x192.png',
      badge: '/favicon/web-app-manifest-192x192.png',
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'Notification', options)
    )
  } catch (err) {
    console.error('Erreur lors de la gestion du push:', err)
  }
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})

// self.addEventListener('install', (event) => {
//   console.log('Service Worker installé');
//     console.log(event)
// });

// self.addEventListener('activate', (event) => {
//   console.log('Service Worker activé');
//   console.log(event)
// });
