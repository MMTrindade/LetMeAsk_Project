import firebase from 'firebase/compat/app';

//Need to import services of authentication and database from Firebase and
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
    /*apiKey: "AIzaSyCosjw6N1u4wGkFjW7w5yf_DNMxWg8fkj4",
    authDomain: "letmeask-b210f.firebaseapp.com",
    databaseURL: "https://letmeask-b210f-default-rtdb.firebaseio.com",
    projectId: "letmeask-b210f",
    storageBucket: "letmeask-b210f.appspot.com",
    messagingSenderId: "467495226703",
    appId: "1:467495226703:web:d9a69e51a282811128493a"*/
  };
  
  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();
  export const database = firebase.database();
