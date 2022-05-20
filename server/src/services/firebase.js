// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC64wHFSXeqNqN_fTVJ1N7I3sacrr0S-_Q",
  authDomain: "contacts-b6a62.firebaseapp.com",
  projectId: "contacts-b6a62",
  storageBucket: "contacts-b6a62.appspot.com",
  messagingSenderId: "271992005149",
  appId: "1:271992005149:web:b630aa734fcb4294f55cf4",
  measurementId: "G-VFPCRZ1GY4",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
