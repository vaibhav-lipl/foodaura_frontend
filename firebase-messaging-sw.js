// Import the Firebase SDKs for app and messaging
// Replace the version number with the version of the Firebase JS SDK you're using in your app.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Alternatively, using the modular SDK (recommended for new projects)
// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// You can find your Firebase config object in your Firebase project settings.
const firebaseConfig = {
  apiKey: "AIzaSyBnQRjNq4UaMPy2w6SLiVRExFxVmCprHoo",
  authDomain: "foodaura-9ac75.firebaseapp.com",
  projectId: "foodaura-9ac75",
  storageBucket: "foodaura-9ac75.firebasestorage.app",
  messagingSenderId: "79262488734",
  appId: "1:79262488734:web:220e4e2da8ff58e31d838f",
  measurementId: "G-N4521FE32W"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
// Or for modular SDK: const firebaseApp = initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();
// Or for modular SDK: const messaging = getMessaging(firebaseApp);

// Optional: Handle background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon || '/firebase-logo.png' // Provide a default icon
//   };
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
