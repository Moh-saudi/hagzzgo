// src/lib/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCQQxUbeQQrlty5HnF65-7TK0TB2zB7R4",
  authDomain: "hagzzgo-87884.firebaseapp.com",
  projectId: "hagzzgo-87884",
  storageBucket: "hagzzgo-87884.firebasestorage.app",
  messagingSenderId: "865241332465",
  appId: "1:865241332465:web:158ed5fb2f0a80eecf0750",
  measurementId: "G-RQ3ENTG6KJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only on client-side
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Export
export { auth, db, storage, analytics };
export default app;