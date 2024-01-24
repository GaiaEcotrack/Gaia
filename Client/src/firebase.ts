import firebase from "firebase/app";
import "firebase/auth"
import { getAuth, Auth } from "firebase/auth";

const app = firebase.initializeApp({
  apiKey: import.meta.env.VITE_APP_APIKEY,
  authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECTID,
  storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APP_APPID,
})

const auth: Auth = getAuth(app);

export { auth };
export default app;