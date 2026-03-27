import { initializeApp, type FirebaseApp } from "firebase/app";
import { getMessaging, type Messaging } from "firebase/messaging";
import { getInstallations, type Installations } from "firebase/installations";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const requiredFirebaseConfigKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const;

export const isFirebaseConfigured = requiredFirebaseConfigKeys.every((key) => {
  const value = firebaseConfig[key];
  return typeof value === "string" && value.trim().length > 0;
});

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;
let installations: Installations | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  installations = getInstallations(app);
  messaging = getMessaging(app);
} else if (import.meta.env.DEV) {
  console.warn("Firebase 환경변수가 누락되어 FCM 기능을 비활성화합니다.");
}

export { app, messaging, installations };

export default app;
