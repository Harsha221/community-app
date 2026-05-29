// src/config/firebase.js
// @react-native-firebase automatically initializes from
// google-services.json (Android) & GoogleService-Info.plist (iOS)
// Alag se initializeApp() ki zaroorat NAHI hai

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';

// ✅ Auth
export const firebaseAuth = auth();

// ✅ Firestore (User profiles, Categories, Experts data)
export const firestoreDB = firestore();

// ✅ Realtime Database (Live chat messages)
export const realtimeDB = database();

// ✅ Storage (Profile images, documents)
export const firebaseStorage = storage();

// ✅ FCM Push Notifications
export const firebaseMessaging = messaging();

// ✅ Firestore Collections — centralized reference
export const COLLECTIONS = {
  USERS      : 'users',       // Admin, Expert, User profiles
  CATEGORIES : 'categories',  // Doctor, Lawyer, CA etc.
  EXPERTS    : 'experts',     // Expert details
  CHATS      : 'chats',       // Chat rooms
  MESSAGES   : 'messages',    // Chat messages
};

// ✅ Realtime DB Paths
export const RT_PATHS = {
  CHATS    : '/chats',
  MESSAGES : (chatId) => `/chats/${chatId}/messages`,
  PRESENCE : (uid) => `/presence/${uid}`,
};

