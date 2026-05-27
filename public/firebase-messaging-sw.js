importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAed5Wb7zazf_RonNfLAdEbu5Td1REtCAA",
  authDomain: "safeeatai-5fb22.firebaseapp.com",
  projectId: "safeeatai-5fb22",
  storageBucket: "safeeatai-5fb22.firebasestorage.app",
  messagingSenderId: "378965514778",
  appId: "1:378965514778:web:2f687047b6a9c4c2174fa3",
  measurementId: "G-WEGJV2BXXG"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'SafeEat AI';
  const notificationOptions = {
    body: payload.notification?.body || 'New notification',
    icon: '/icon-192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});