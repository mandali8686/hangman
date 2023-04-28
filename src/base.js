import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCPbFW85A-XHH2NMkH_e3vu2dNDtlB3wYA",
    authDomain: "hangmangameapp-42637.firebaseapp.com",
    projectId: "hangmangameapp-42637",
    storageBucket: "hangmangameapp-42637.appspot.com",
    messagingSenderId: "837184372758",
    appId: "1:837184372758:web:0780749bda7d10c7eef537",
    measurementId: "G-E6BF6F2YSW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
  