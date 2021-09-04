import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseConfig from "../../firebase.json";

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export { firebase, auth };
