import { auth, db } from "@/app/lib/db";
import { GlobalContextDispatch } from "@/app/state/context/globalContextProvider";
import { doc, getDoc } from "firebase/firestore";
import { useContext } from "react";
import toast from "react-hot-toast";


const fetchCurrentUser = () => {
    const fetchUser = async () => {

        if (!auth?.currentUser?.email) return;
        const currentUserRef = doc(db, "users", auth.currentUser.email);
        const currentUserSnap = await getDoc(currentUserRef);

        if (currentUserSnap.exists()) {
       
            return currentUserSnap.data()
        } else {
            null
        }
    }
    return  {fetchUser} 
}

export default fetchCurrentUser
