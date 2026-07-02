import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const MISSING_VARS = !firebaseConfig.apiKey || !firebaseConfig.projectId;

class FirebaseAppClass {
  private static instance: FirebaseAppClass;
  public app: FirebaseApp | null = null;
  public auth: Auth | null = null;
  public db: Firestore | null = null;
  public storage: FirebaseStorage | null = null;
  public messaging: Messaging | null = null;
  public isAvailable = false;

  private constructor() {
    if (MISSING_VARS) return;
    try {
      this.app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.storage = getStorage(this.app);
      this.isAvailable = true;
      this.initMessaging();
    } catch {
      console.warn('Firebase initialization failed – running in offline mode');
    }
  }

  private async initMessaging() {
    try {
      if (await isSupported()) {
        this.messaging = getMessaging(this.app!);
      }
    } catch { /* messaging not supported */ }
  }

  static getInstance(): FirebaseAppClass {
    if (!FirebaseAppClass.instance) {
      FirebaseAppClass.instance = new FirebaseAppClass();
    }
    return FirebaseAppClass.instance;
  }
}

export const firebaseApp = FirebaseAppClass.getInstance();
export const { auth, db, storage, messaging } = firebaseApp;
