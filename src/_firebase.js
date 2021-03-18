import * as firebase from 'firebase/app'
import 'firebase/auth'


// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "ADD YOUR VALUE HERE",
  authDomain: "ADD YOUR VALUE HERE",
  databaseURL: "ADD YOUR VALUE HERE",
  projectId: "ADD YOUR VALUE HERE",
  storageBucket: "ADD YOUR VALUE HERE",
  messagingSenderId: "ADD YOUR VALUE HERE",
  appId: "ADD YOUR VALUE HERE"
};

firebase.initializeApp(firebaseConfig)


const auth = firebase.auth()


// export utils/refs
export default auth