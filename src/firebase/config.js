import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDm7IF4tZ2iON-VkwUwoZfhGMKka0cRIKY",
  authDomain: "tasksync-1.firebaseapp.com",
  projectId: "tasksync-1",
  storageBucket: "tasksync-1.appspot.com",
  messagingSenderId: "512400433776",
  appId: "1:512400433776:web:86af084da8b4c1ee640ab5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Ensure auth is initialized
auth.useDeviceLanguage();