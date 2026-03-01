// js/firebase/config.js
// Firebase app initialization

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBdSG6aWFGz-ZqgFUp7R1KjKPAxX73XZEg",
  authDomain:        "voluntir-38c1c.firebaseapp.com",
  databaseURL:       "https://voluntir-38c1c-default-rtdb.firebaseio.com",
  projectId:         "voluntir-38c1c",
  storageBucket:     "voluntir-38c1c.firebasestorage.app",
  messagingSenderId: "341357751723",
  appId:             "1:341357751723:web:9757e2bb80e20cea55f6ee",
};

let _app = null, _auth = null, _db = null, _fb = {};

async function loadFirebase() {
  if (_app) return { auth: _auth, db: _db, ..._fb };

  const [am, au, fi] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),
  ]);

  _app  = am.initializeApp(FIREBASE_CONFIG);
  _auth = au.getAuth(_app);
  _db   = fi.getFirestore(_app);

  _fb = {
    GoogleAuthProvider: au.GoogleAuthProvider,
    signInWithPopup:    au.signInWithPopup,
    signOut:            au.signOut,
    onAuthStateChanged: au.onAuthStateChanged,
    collection:         fi.collection,
    doc:                fi.doc,
    getDoc:             fi.getDoc,
    getDocs:            fi.getDocs,
    setDoc:             fi.setDoc,
    addDoc:             fi.addDoc,
    deleteDoc:          fi.deleteDoc,
    query:              fi.query,
    orderBy:            fi.orderBy,
    arrayUnion:         fi.arrayUnion,
    arrayRemove:        fi.arrayRemove,
    increment:          fi.increment,
    serverTimestamp:    fi.serverTimestamp,
  };

  return { auth: _auth, db: _db, ..._fb };
}

window.loadFirebase = loadFirebase;
