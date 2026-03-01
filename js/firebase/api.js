// js/firebase/api.js
// All Firebase read/write operations

async function fbSignIn() {
  const fb = await loadFirebase();
  return fb.signInWithPopup(fb.auth, new fb.GoogleAuthProvider());
}

async function fbSignOut() {
  const fb = await loadFirebase();
  return fb.signOut(fb.auth);
}

async function fbGetProfile(uid) {
  const fb = await loadFirebase();
  const s  = await fb.getDoc(fb.doc(fb.db, "users", uid));
  return s.exists() ? s.data() : null;
}

async function fbSetProfile(uid, data) {
  const fb = await loadFirebase();
  await fb.setDoc(fb.doc(fb.db, "users", uid), data, { merge: true });
}

async function fbGetListings() {
  const fb = await loadFirebase();
  const q  = fb.query(fb.collection(fb.db, "listings"), fb.orderBy("date", "asc"));
  const s  = await fb.getDocs(q);
  return s.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function fbAddListing(data) {
  const fb = await loadFirebase();
  const r  = await fb.addDoc(fb.collection(fb.db, "listings"), { ...data, createdAt: fb.serverTimestamp() });
  return r.id;
}

async function fbDeleteListing(id) {
  const fb = await loadFirebase();
  await fb.deleteDoc(fb.doc(fb.db, "listings", id));
}

async function fbSignUp(lid, uid, hours) {
  const fb = await loadFirebase();
  await fb.setDoc(fb.doc(fb.db, "listings", lid), { volunteers: fb.arrayUnion(uid), currentVolunteers: fb.increment(1) }, { merge: true });
  await fb.setDoc(fb.doc(fb.db, "users", uid), { hoursServed: fb.increment(hours) }, { merge: true });
}

async function fbUnsign(lid, uid, hours) {
  const fb  = await loadFirebase();
  await fb.setDoc(fb.doc(fb.db, "listings", lid), { volunteers: fb.arrayRemove(uid), currentVolunteers: fb.increment(-1) }, { merge: true });
  const s   = await fb.getDoc(fb.doc(fb.db, "users", uid));
  const cur = s.exists() ? (s.data().hoursServed || 0) : 0;
  await fb.setDoc(fb.doc(fb.db, "users", uid), { hoursServed: Math.max(0, cur - hours) }, { merge: true });
}

async function fbGetLeaderboard() {
  const fb = await loadFirebase();
  const q  = fb.query(fb.collection(fb.db, "users"), fb.orderBy("hoursServed", "desc"));
  const s  = await fb.getDocs(q);
  return s.docs.map(d => ({ uid: d.id, ...d.data() }));
}

async function fbGetUsersByIds(uids) {
  if (!uids || uids.length === 0) return [];
  const fb      = await loadFirebase();
  const results = await Promise.all(uids.map(async uid => {
    try {
      const s = await fb.getDoc(fb.doc(fb.db, "users", uid));
      return s.exists() ? { uid, ...s.data() } : null;
    } catch (e) { return null; }
  }));
  return results.filter(Boolean);
}

async function fbDeductHoursFromUsers(uids, hours) {
  if (!uids || uids.length === 0) return;
  const fb = await loadFirebase();
  await Promise.all(uids.map(async uid => {
    try {
      const s   = await fb.getDoc(fb.doc(fb.db, "users", uid));
      const cur = s.exists() ? (s.data().hoursServed || 0) : 0;
      await fb.setDoc(fb.doc(fb.db, "users", uid), { hoursServed: Math.max(0, cur - hours) }, { merge: true });
    } catch (e) { console.error("deduct error", uid, e); }
  }));
}

// Expose globals
window.fbSignIn               = fbSignIn;
window.fbSignOut              = fbSignOut;
window.fbGetProfile           = fbGetProfile;
window.fbSetProfile           = fbSetProfile;
window.fbGetListings          = fbGetListings;
window.fbAddListing           = fbAddListing;
window.fbDeleteListing        = fbDeleteListing;
window.fbSignUp               = fbSignUp;
window.fbUnsign               = fbUnsign;
window.fbGetLeaderboard       = fbGetLeaderboard;
window.fbGetUsersByIds        = fbGetUsersByIds;
window.fbDeductHoursFromUsers = fbDeductHoursFromUsers;
