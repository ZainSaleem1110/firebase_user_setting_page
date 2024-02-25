import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  deleteUser
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getDownloadURL, getStorage, ref, uploadBytes, listAll } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsHfwFcr0LxDHGl-Ps5KB7CPS5YffehyE",
  authDomain: "tasktask-108aa.firebaseapp.com",
  databaseURL: "https://tasktask-108aa-default-rtdb.firebaseio.com",
  projectId: "tasktask-108aa",
  storageBucket: "tasktask-108aa.appspot.com",
  messagingSenderId: "969867762460",
  appId: "1:969867762460:web:7f217e7e2ca2164837f8d9",
  measurementId: "G-PBPGCEF14H",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);

export {
  auth,
  db,
  firebaseApp,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  database,
  googleProvider,
  getDownloadURL,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  storage,
  signInWithPopup,
  signInWithEmailAndPassword,
  ref,
  signOut,
  uploadBytes,
  onAuthStateChanged,
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc,
  deleteUser,
  listAll
};
