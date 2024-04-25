
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDHkKA36PzmiHEJrMJnE69u4RlpbkRDI0",
  authDomain: "trello-clone-ec167.firebaseapp.com",
  projectId: "trello-clone-ec167",
  storageBucket: "trello-clone-ec167.appspot.com",
  messagingSenderId: "337026507090",
  appId: "1:337026507090:web:89f944ec3cebb69aea1a8b",
  measurementId: "G-ZXM7Y92WKM"
};

// Initialize Firebase
export const  app = initializeApp(firebaseConfig);
