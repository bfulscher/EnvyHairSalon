// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
     apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,

     authDomain: "envy-hair-salon-project.firebaseapp.com",

     projectId: "envy-hair-salon-project",
   
     storageBucket: "envy-hair-salon-project.appspot.com",
   
     messagingSenderId: "1028881372274",
   
     appId: "1:1028881372274:web:eac6479cfd1640b3211eeb",
   
     measurementId: "G-GW272WQER5"
  
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

