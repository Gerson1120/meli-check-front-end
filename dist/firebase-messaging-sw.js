// Service Worker para Firebase Cloud Messaging
// Este archivo maneja las notificaciones cuando la aplicación está en background o cerrada

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuración de Firebase (debe coincidir con firebase-config.js)
const firebaseConfig = {
  apiKey: "AIzaSyCQ4zmGyhXAc-xSh3nPujfeg9eEAfiPfV4",
  authDomain: "cygdp-7c00f.firebaseapp.com",
  projectId: "cygdp-7c00f",
  storageBucket: "cygdp-7c00f.firebasestorage.app",
  messagingSenderId: "966588180784",
  appId: "1:966588180784:web:1de673a345d89bfcad00f5"
};

// Inicializar Firebase en el Service Worker
firebase.initializeApp(firebaseConfig);

// Obtener instancia de messaging
const messaging = firebase.messaging();

// Manejar notificaciones en background
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notificación recibida en background:', payload);

  const notificationTitle = payload.notification?.title || 'MeliCheck';
  const notificationOptions = {
    body: payload.notification?.body || 'Nueva notificación',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: payload.data,
    requireInteraction: true,
    tag: payload.data?.type || 'notification'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clicks en las notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notificación clickeada:', event);

  event.notification.close();

  // Abrir la aplicación cuando se hace click en la notificación
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes('localhost') || client.url.includes('127.0.0.1')) {
          return client.focus();
        }
      }
      // Si no hay ventana abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});