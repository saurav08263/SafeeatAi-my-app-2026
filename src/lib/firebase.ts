/**
 * Firebase Configuration Module
 *
 * This module provides a safe Firebase initialization pattern that works
 * even when the `firebase` package is not installed yet. Exports are null
 * until Firebase is installed and environment variables are configured.
 *
 * When `firebase` is installed and NEXT_PUBLIC_FIREBASE_API_KEY is set,
 * call `initFirebase()` to initialize, or the exports will remain null.
 */

let app: any = null;
let auth: any = null;
let firestore: any = null;

/**
 * Returns true if the Firebase API key is set in environment variables.
 */
export function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
}

/**
 * Initialize Firebase App, Auth, and Firestore.
 * Should be called only after the `firebase` package is installed.
 * Returns the initialized instances or null if configuration is missing.
 */
export async function initFirebase() {
  if (!isFirebaseConfigured()) {
    console.warn(
      "[SafeEat AI] Firebase API key not found. Set NEXT_PUBLIC_FIREBASE_API_KEY in .env.local"
    );
    return { app: null, auth: null, db: null };
  }

  try {
    const { initializeApp, getApps } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");
    const { getFirestore } = await import("firebase/firestore");

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    // Initialize only if no apps exist yet (prevent double-init in dev)
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    firestore = getFirestore(app);

    return { app, auth, db: firestore };
  } catch {
    console.warn(
      "[SafeEat AI] Firebase SDK not found. Install `firebase` package to enable auth & Firestore."
    );
    return { app: null, auth: null, db: null };
  }
}

export { app, auth, firestore as db };
