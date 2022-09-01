import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FB_API_KEY,
  authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FB_DB_URL,
  projectId: process.env.VUE_APP_FB_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FB_MSG_SENDER_ID,
  appId: process.env.VUE_APP_FB_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

//console.log(process.env.VUE_APP_AUTH_EMULATOR_URL);

if (process.env.VUE_APP_AUTH_EMULATOR_URL) {
  connectAuthEmulator(auth, process.env.VUE_APP_AUTH_EMULATOR_URL);
}

// export utils/refs
export default auth;
