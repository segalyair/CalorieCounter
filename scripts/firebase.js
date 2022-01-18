// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcQDEADj5qFMEg8eDNnHOXXO-FihU7oH0",
    authDomain: "toptal-yair.firebaseapp.com",
    databaseURL: "https://toptal-yair-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "toptal-yair",
    storageBucket: "toptal-yair.appspot.com",
    messagingSenderId: "623343378615",
    appId: "1:623343378615:web:286ec10f6bbf8c05152d32"
};

let app;
export let db;

export function initializeFirebase() {
    app = initializeApp(firebaseConfig);
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
    db = getDatabase(app);
}