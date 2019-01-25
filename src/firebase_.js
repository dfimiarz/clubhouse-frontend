import firebase from 'firebase'
import 'firebase/firestore'


  const config = {
    apiKey: "xxx",
    authDomain: "xxx.firebaseapp.com",
    databaseURL: "https://xxx.firebaseio.com",
    projectId: "xxx",
    storageBucket: "xxx.appspot.com",
    messagingSenderId: "xxx"
  };

  const firebaseApp = firebase.initializeApp(config);

  const firestore = firebaseApp.firestore()

  export default firestore