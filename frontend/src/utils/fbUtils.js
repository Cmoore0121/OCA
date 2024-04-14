import { initializeApp } from 'fireabse/app'
import {getFirestore, collection, getDocs} from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCf8iDTkKmyen5vmq8b9bo8zEU5hXjGfqc",
    authDomain: "oca-sourcing.firebaseapp.com",
    projectId: "oca-sourcing",
    storageBucket: "oca-sourcing.appspot.com",
    messagingSenderId: "884281157514",
    appId: "1:884281157514:web:d93d3b87d6b4a5cfa90a73",
    measurementId: "G-MYNZ2CKXQ4"
  };


initializeApp(firebaseConfig);
const db = getFirestore()
const colRef = collection(db, "ppp")



