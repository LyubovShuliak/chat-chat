// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBywblVistLnj3gbokmmXzKxsyn6DUIip4",
  authDomain: "chat-chati.firebaseapp.com",
  projectId: "chat-chati",
  storageBucket: "chat-chati.appspot.com",
  messagingSenderId: "207622216666",
  appId: "1:207622216666:web:abbbf6775d39ad5e5bfee3",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
