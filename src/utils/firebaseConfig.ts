// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore, collection } from 'firebase/firestore'
import {FirebaseApiKey} from './securityConstants'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: FirebaseApiKey,
    authDomain: "getlandonfoot.firebaseapp.com",
    projectId: "getlandonfoot",
    storageBucket: "getlandonfoot.appspot.com",
    messagingSenderId: "720486195082",
    appId: "1:720486195082:web:5f9384a2daf88ab1cbf273",
    measurementId: "G-NSLN54ZPV9"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth()

const firestore = getFirestore()

const adminCollection = collection(firestore,'admins')
export { auth, adminCollection }