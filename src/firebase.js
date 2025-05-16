import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyExampleKey1234",
  authDomain: "space-lesson.firebaseapp.com",
  projectId: "space-lesson",
  storageBucket: "space-lesson.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:exampleappid"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };