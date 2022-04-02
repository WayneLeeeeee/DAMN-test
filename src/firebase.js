// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBYmb5Ldbqj365um8snMnQ-TnyV7N35tzE",
  authDomain: "damn-pwa.firebaseapp.com",
  projectId: "damn-pwa",
  storageBucket: "damn-pwa.appspot.com",
  messagingSenderId: "613894965428",
  appId: "1:613894965428:web:1266eba43b48bf8b84efe1",
  measurementId: "G-4PMZDKQZBX",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
const auth = getAuth();
export { app, db, storage, auth, firebaseConfig };
