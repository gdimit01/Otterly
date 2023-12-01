// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { EmailAuthProvider } from "@firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // Updated to use an environment variable
  authDomain: "msc2-36ce5.firebaseapp.com",
  projectId: "msc2-36ce5",
  storageBucket: "msc2-36ce5.appspot.com",
  messagingSenderId: "324696980723",
  appId: "1:324696980723:web:999fd44ad3c66fea53cb86",
  measurementId: "G-55N50548VV",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
