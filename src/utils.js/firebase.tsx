// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAVH_rTNEty24CSpaNJnrYwZrU04qGUly4",
    authDomain: "easy3dpage.firebaseapp.com",
    projectId: "easy3dpage",
    storageBucket: "easy3dpage.appspot.com",
    messagingSenderId: "122891595637",
    appId: "1:122891595637:web:3bf95ca76567052df5ed3c",
    measurementId: "G-96SHS4SQ70",
    databaseURL: "https://easy3dpage-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);