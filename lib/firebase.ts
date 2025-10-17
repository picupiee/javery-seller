import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import {getAnalytics} from "firebase/analytics"

type ExpoExtraConfig = {[key: string]: any} | undefined

const getConfigValue = (key: string): string => {
const extraConfig = Constants.expoConfig?.extra as ExpoExtraConfig
const value = process.env[key]
?? extraConfig?.[key]

if (!value || typeof value !== 'string') {
  throw new Error(`Firebase key ${key} is missing, undefined or not a string. Check your .env file`)
}
return value
}

const firebaseConfig = {
  apiKey: getConfigValue('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getConfigValue('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getConfigValue('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getConfigValue('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getConfigValue('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getConfigValue('EXPO_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getConfigValue('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID')
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app);
export const db = getFirestore(app)