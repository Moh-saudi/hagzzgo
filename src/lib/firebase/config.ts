// src/lib/firebase/config.ts
import { initializeApp } from "firebase/app";
<<<<<<< HEAD
import { getAuth } from "firebase/auth";
=======
import { getAuth, GoogleAuthProvider } from "firebase/auth";
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
<<<<<<< HEAD
  apiKey: "AIzaSyDCQQxUbeQQrlty5HnF65-7TK0TB2zB7R4",
  authDomain: "hagzzgo-87884.firebaseapp.com",
  projectId: "hagzzgo-87884",
  storageBucket: "hagzzgo-87884.firebasestorage.app",
  messagingSenderId: "865241332465",
  appId: "1:865241332465:web:158ed5fb2f0a80eecf0750",
  measurementId: "G-RQ3ENTG6KJ"
=======
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDCQQxUbeQQrlty5HnF65-7TK0TB2zB7R4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hagzzgo-87884.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hagzzgo-87884",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hagzzgo-87884.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "865241332465",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:865241332465:web:158ed5fb2f0a80eecf0750",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-RQ3ENTG6KJ"
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
<<<<<<< HEAD
=======
const googleProvider = new GoogleAuthProvider();
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only on client-side
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Export
<<<<<<< HEAD
export { auth, db, storage, analytics };
=======
export { auth, googleProvider, db, storage, analytics };
>>>>>>> bca22f5650d9d75baeb93f1e7ba3fc2055bf8bd6
export default app;