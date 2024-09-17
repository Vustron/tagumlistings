// utils
import { getApp, getApps, initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// configs
import { env } from "@/lib/config/env.mjs"

// firebase config
const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// init app
const firebaseApp =
  getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)

// init firestore
const firestore = getFirestore(firebaseApp)

// init storage
const firebaseStorage = getStorage(firebaseApp)

export { firestore, firebaseStorage }
