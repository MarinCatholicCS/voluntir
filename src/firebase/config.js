import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBdSG6aWFGz-ZqgFUp7R1KjKPAxX73XZEg",
  authDomain:        "voluntir-38c1c.firebaseapp.com",
  databaseURL:       "https://voluntir-38c1c-default-rtdb.firebaseio.com",
  projectId:         "voluntir-38c1c",
  storageBucket:     "voluntir-38c1c.firebasestorage.app",
  messagingSenderId: "341357751723",
  appId:             "1:341357751723:web:9757e2bb80e20cea55f6ee",
}

const app = initializeApp(FIREBASE_CONFIG)

export const auth = getAuth(app)
export const db   = getFirestore(app)
