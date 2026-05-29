// ✅ Modular API — no more namespaced calls
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';
import { getDatabase } from '@react-native-firebase/database';

export const app      = getApp();
export const auth     = getAuth();
export const db       = getFirestore();
export const storage  = getStorage();
export const database = getDatabase();

export const COLLECTIONS = {
  USERS      : 'users',
  CATEGORIES : 'categories',
  EXPERTS    : 'experts',
  CHATS      : 'chats',
  MESSAGES   : 'messages',
};

export const RT_PATHS = {
  MESSAGES : (chatId) => `/chats/${chatId}/messages`,
  PRESENCE : (uid)   => `/presence/${uid}`,
};