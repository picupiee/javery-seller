import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBovbTv6dVFJSb-jR8C9LZqPjBzWS49AxI",
  authDomain: "javery-72191.firebaseapp.com",
  projectId: "javery-72191",
  storageBucket: "javery-72191.firebasestorage.app",
  messagingSenderId: "417678757547",
  appId: "1:417678757547:web:b1626cd0374383c83271ee",
  measurementId: "G-X3149815YE"
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)