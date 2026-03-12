import { GoogleAuthProvider, signInWithPopup, signInWithCredential, signOut } from 'firebase/auth'
import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc,
  query, orderBy, arrayUnion, arrayRemove, increment, serverTimestamp,
} from 'firebase/firestore'
import { Platform } from 'react-native'
import { auth, db } from './config'

export async function fbSignIn() {
  if (Platform.OS === 'web') {
    return signInWithPopup(auth, new GoogleAuthProvider())
  }
  throw new Error('Use fbSignInWithCredential on native')
}

export async function fbSignInWithCredential(idToken) {
  const credential = GoogleAuthProvider.credential(idToken)
  return signInWithCredential(auth, credential)
}

export async function fbSignOut() {
  return signOut(auth)
}

export async function fbGetProfile(uid) {
  const s = await getDoc(doc(db, "users", uid))
  return s.exists() ? s.data() : null
}

export async function fbSetProfile(uid, data) {
  await setDoc(doc(db, "users", uid), data, { merge: true })
}

export async function fbGetListings() {
  const q = query(collection(db, "listings"), orderBy("date", "asc"))
  const s = await getDocs(q)
  return s.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function fbAddListing(data) {
  const r = await addDoc(collection(db, "listings"), { ...data, createdAt: serverTimestamp() })
  return r.id
}

export async function fbDeleteListing(id, confirmedVolunteers, hours) {
  if (confirmedVolunteers && confirmedVolunteers.length > 0 && hours > 0) {
    await Promise.all(confirmedVolunteers.map(async uid => {
      const s = await getDoc(doc(db, "users", uid))
      const cur = s.exists() ? (s.data().hoursServed || 0) : 0
      await setDoc(doc(db, "users", uid), { hoursServed: Math.max(0, cur - hours) }, { merge: true })
    }))
  }
  await deleteDoc(doc(db, "listings", id))
}

export async function fbSignUp(lid, uid) {
  await setDoc(doc(db, "listings", lid), { volunteers: arrayUnion(uid), currentVolunteers: increment(1) }, { merge: true })
}

export async function fbUnsign(lid, uid) {
  await setDoc(doc(db, "listings", lid), { volunteers: arrayRemove(uid), currentVolunteers: increment(-1) }, { merge: true })
}

export async function fbGetLeaderboard() {
  const q = query(collection(db, "users"), orderBy("hoursServed", "desc"))
  const s = await getDocs(q)
  return s.docs.map(d => ({ uid: d.id, ...d.data() }))
}

export async function fbGetUsersByIds(uids) {
  if (!uids || uids.length === 0) return []
  const results = await Promise.all(uids.map(async uid => {
    try {
      const s = await getDoc(doc(db, "users", uid))
      return s.exists() ? { uid, ...s.data() } : null
    } catch (e) { return null }
  }))
  return results.filter(Boolean)
}

export async function fbConfirmHours(lid, uid, hours) {
  await setDoc(doc(db, "listings", lid), { confirmedVolunteers: arrayUnion(uid) }, { merge: true })
  await setDoc(doc(db, "users", uid), { hoursServed: increment(hours) }, { merge: true })
}

export async function fbUnconfirmHours(lid, uid, hours) {
  await setDoc(doc(db, "listings", lid), { confirmedVolunteers: arrayRemove(uid) }, { merge: true })
  const s   = await getDoc(doc(db, "users", uid))
  const cur = s.exists() ? (s.data().hoursServed || 0) : 0
  await setDoc(doc(db, "users", uid), { hoursServed: Math.max(0, cur - hours) }, { merge: true })
}
