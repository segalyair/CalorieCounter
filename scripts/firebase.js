// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-ZMfdZ7pRj590aYoW3SuW4qoqT9gaUe8",
    authDomain: "kalorie-tracker.firebaseapp.com",
    databaseURL: "https://kalorie-tracker-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kalorie-tracker",
    storageBucket: "kalorie-tracker.appspot.com",
    messagingSenderId: "914381474228",
    appId: "1:914381474228:web:639024e8ab53c00ffecae1"
  };
  

let app;
export let db;

export function initializeFirebase() {
    app = initializeApp(firebaseConfig);
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
    db = getDatabase(app);
}