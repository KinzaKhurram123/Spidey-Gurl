import { initializeApp } from 'firebase/app'
import { initializeFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
const db = isFirebaseConfigured
  ? initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false }, 'default')
  : null

const SURPRISES_DOC = (surprise) => doc(db, 'surprises', surprise)

export function publishSurprise(surprise, data) {
  if (!db) return Promise.resolve()
  return setDoc(SURPRISES_DOC(surprise), data)
}

export function subscribeSurprise(surprise, onData, onError) {
  if (!db) return () => {}
  return onSnapshot(SURPRISES_DOC(surprise), (snap) => onData(snap.exists() ? snap.data() : null), onError)
}
