importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDgHPn_29cvngHV5cbyvTTdq6tqIczjdf8",
  authDomain: "csbs-sync-2fab7.firebaseapp.com",
  projectId: "csbs-sync-2fab7",
  storageBucket: "csbs-sync-2fab7.firebasestorage.app",
  messagingSenderId: "98708204734",
  appId: "1:98708204734:web:97a98b1fe34cf6603a82ef"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});
