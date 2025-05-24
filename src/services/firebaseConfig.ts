import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAldqLNjyA3fQ9zagyKuBSzzh5tDUYKKC0",
  authDomain: "algoritmos-ecba6.firebaseapp.com",
  projectId: "algoritmos-ecba6",
  storageBucket: "algoritmos-ecba6.firebasestorage.app",
  messagingSenderId: "284829680857",
  appId: "1:284829680857:web:2528c4b24fadb32e6d6ac8",
  measurementId: "G-EZFDHDCXNX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);