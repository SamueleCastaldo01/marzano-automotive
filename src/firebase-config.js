import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGV8GRK_yPee5qbDyew1Krepie1cYuZh8",
  authDomain: "marzano-automotive.firebaseapp.com",
  projectId: "marzano-automotive",
  storageBucket: "marzano-automotive.appspot.com",
  messagingSenderId: "248793604751",
  appId: "1:248793604751:web:befdff8174575a897146fa",
  measurementId: "G-XWVMVYBQLT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app)
export const providerGoogle = new GoogleAuthProvider();

export function signup(email, password) {
    return  createUserWithEmailAndPassword(auth, email, password);
  }
  
  export function login(email, password) {
    return  signInWithEmailAndPassword(auth, email, password);
  }
  
  export function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }