import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot,Timestamp,addDoc,deleteDoc,doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiV1CmEblxoYVsLgrj8JmEfs-o9qYo11g",
  authDomain: "dashborad-solar.firebaseapp.com",
  projectId: "dashborad-solar",
  storageBucket: "dashborad-solar.firebasestorage.app",
  messagingSenderId: "47996859911",
  appId: "1:47996859911:web:8210a3f791d905f7b6dca2",
  measurementId: "G-T2LDM9XPC8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, onSnapshot,Timestamp,addDoc,deleteDoc,doc };
