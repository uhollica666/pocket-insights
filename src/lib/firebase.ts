
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration is read from environment variables
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Added this line
};

// Log the config to the client's console for debugging
if (typeof window !== 'undefined') {
  console.log("Firebase Config Loaded by Client:", firebaseConfig);
}

// Initialize Firebase
let app;
if (!getApps().length) {
  // Check if all required config values are present
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
      'Firebase API Key or Project ID is missing. Please check your .env.local file or the environment variables.'
    );
    // Potentially throw an error or handle this state appropriately
    // For now, we'll let it proceed, but Firestore operations will likely fail.
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

export { db, app }; // Exporting app as well in case it's needed elsewhere
