import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getFirestore} from 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyCdHt9YfOQU6LGn25AbJ4U4ExjNFeUO4T4",
    authDomain: "tugerente-fb119.firebaseapp.com",
    projectId: "tugerente-fb119",
    storageBucket: "tugerente-fb119.appspot.com",
    messagingSenderId: "915533215455",
    appId: "1:915533215455:web:6f88790a452c9c67709b6a",
    measurementId: "G-KXPQCBFM9L"
  };

const firebaseApp=firebase.initializeApp(firebaseConfig);
export const dataBase = getFirestore(firebaseApp)
const db = firebase.firestore();

export default db;