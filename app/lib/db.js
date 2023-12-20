import { getApp, getApps, initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyD422VRhzAZye9BA3FVmguSce0kdDIeCwE",
  authDomain: "instagram-clone-e702c.firebaseapp.com",
  projectId: "instagram-clone-e702c",
  storageBucket: "instagram-clone-e702c.appspot.com",
  messagingSenderId: "764161146861",
  appId: "1:764161146861:web:f0a04ba6382480fe7631e4"
};
const app = !getApps().length ? initializeApp(firebaseConfig):getApp();
const db= getFirestore();
const auth = getAuth();
const storage= getStorage();
export{app,db,auth,storage};