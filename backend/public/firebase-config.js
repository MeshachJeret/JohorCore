// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD6AujU3SxWAw4zrltO9gWJHllkvojTn88",
    authDomain: "johor-core-33d8c.firebaseapp.com",
    projectId: "johor-core-33d8c",
    storageBucket: "johor-core-33d8c.firebasestorage.app",
    messagingSenderId: "526658808469",
    appId: "1:526658808469:web:6630f2b90d7e44dcdd899c",
    measurementId: "G-DKTDNZ1B07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);