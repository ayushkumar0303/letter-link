// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "letter-link-ca5f0.firebaseapp.com",
  projectId: "letter-link-ca5f0",
  storageBucket: "letter-link-ca5f0.firebasestorage.app",
  messagingSenderId: "584875828570",
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
