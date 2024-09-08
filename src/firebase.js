// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAxBsCcXs6ItISOIKd7kL2NDFMxRBMd3oc",

  authDomain: "envysalon-1f155.firebaseapp.com",

  projectId: "envysalon-1f155",

  storageBucket: "envysalon-1f155.appspot.com",

  messagingSenderId: "44266186916",

  appId: "1:44266186916:web:ce862317dc7aaacc895e31",

  measurementId: "G-CB51RC8SDG"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

console.log('Firebase initialized:', app);
console.log('Auth initialized:', auth);
console.log('Firestore initialized:', db);

export { auth, db };