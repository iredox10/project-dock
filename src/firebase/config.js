// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB48QhLZUJl3v6D4B95XrEM36lKtjDkRVI",
  authDomain: "project-dock-803ba.firebaseapp.com",
  projectId: "project-dock-803ba",
  storageBucket: "project-dock-803ba.firebasestorage.app",
  messagingSenderId: "458706334409",
  appId: "1:458706334409:web:6db189eb1379a67fc2d318",
  measurementId: "G-CD7CM1LTMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
