import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1uvalNp87wSIEdEhhJpucI5bcYCEKGwY",
  authDomain: "spek-a8750.firebaseapp.com",
  projectId: "spek-a8750",
  storageBucket: "spek-a8750.firebasestorage.app",
  messagingSenderId: "1014449197335",
  appId: "1:1014449197335:web:6b9f8c509da0c9ef2be752",
  measurementId: "G-00EWYJM1PZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Google provider with prompts
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider };