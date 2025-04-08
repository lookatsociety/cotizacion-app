import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration - Usando valores de configuración
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB1uvalNp87wSIEdEhhJpucI5bcYCEKGwY",
  authDomain: "spek-a8750.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "spek-a8750",
  storageBucket: "spek-a8750.firebasestorage.app",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1014449197335:web:6b9f8c509da0c9ef2be752"
};

// Initialize Firebase - evitando inicialización duplicada
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    console.info('Firebase ya fue inicializado, usando la instancia existente');
  } else {
    console.error('Error al inicializar Firebase:', error);
    throw error;
  }
}
const auth = getAuth();

// Configure Google provider with prompts
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider };