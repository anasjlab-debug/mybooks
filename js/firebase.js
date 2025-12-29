// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCrRV7crYKXt2SSIYS8f1nLn8XRffVnrI8",
  authDomain: "mybooks-75476.firebaseapp.com",
  projectId: "mybooks-75476",
  storageBucket: "mybooks-75476.firebasestorage.app",
  messagingSenderId: "579709784830",
  appId: "1:579709784830:web:183b9ffc578bd562becbaf",
  measurementId: "G-8Y0N056TGB"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth helpers
const googleProvider = new GoogleAuthProvider();

export function loginWithGoogle() {
  // ✅ الحل النهائي المستقر
  return signInWithRedirect(auth, googleProvider);
}

export function loginAnonymously() {
  return signInAnonymously(auth);
}

export function onUserChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

// Firestore helpers
export function addChapterComment(data) {
  return addDoc(collection(db, "chapter_comments"), {
    ...data,
    createdAt: serverTimestamp()
  });
}

export function listenChapterComments(key, callback) {
  const q = query(
    collection(db, "chapter_comments"),
    where("key", "==", key),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, snapshot => {
    const comments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(comments);
  });
}
