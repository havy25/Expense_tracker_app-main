// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBjnpzNTIo0sYDImyv7DnkCc8XRh5XArxY",
  authDomain: "expense-73542.firebaseapp.com",
  projectId: "expense-73542",
  storageBucket: "expense-73542.firebasestorage.app",
  messagingSenderId: "374552525619",
  appId: "1:374552525619:web:e93b50b0b13779b0bb1c46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
//db
export const firestore = getFirestore(app);
