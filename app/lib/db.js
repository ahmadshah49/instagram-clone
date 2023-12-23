import { getApp, getApps, initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyDKko2Dp4O-yOMxfa0rRwYARmrkewqcrZg",
  authDomain: "instagram-11fc5.firebaseapp.com",
  projectId: "instagram-11fc5",
  storageBucket: "instagram-11fc5.appspot.com",
  messagingSenderId: "888026836980",
  appId: "1:888026836980:web:8a614cf6ffc5eff34293a1"
};
const app = !getApps().length ? initializeApp(firebaseConfig):getApp();
const db= getFirestore();
const auth = getAuth();
const storage= getStorage();
export{app,db,auth,storage};
