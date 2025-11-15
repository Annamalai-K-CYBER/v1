import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgHPn_29cvngHV5cbyvTTdq6tqIczjdf8",
  authDomain: "csbs-sync-2fab7.firebaseapp.com",
  projectId: "csbs-sync-2fab7",
  storageBucket: "csbs-sync-2fab7.firebasestorage.app",
  messagingSenderId: "98708204734",
  appId: "1:98708204734:web:97a98b1fe34cf6603a82ef"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const messaging = firebase.messaging();
export const firestore = firebase.firestore();
