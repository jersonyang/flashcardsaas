// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCujlZyNKGI5yhu4ndEehZ7NPwrjTTdCx4",
  authDomain: "flashcard-saas-f6141.firebaseapp.com",
  projectId: "flashcard-saas-f6141",
  storageBucket: "flashcard-saas-f6141.appspot.com",
  messagingSenderId: "1005117049801",
  appId: "1:1005117049801:web:48710baaefcdb0ef77b618",
  measurementId: "G-2QYH4HE450"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
const db = getFirestore(app)

export {db}