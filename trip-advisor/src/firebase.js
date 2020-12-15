import firebase from "firebase";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLNfKTV-4Uo1qYcp1ABcd3Rj51qkN7FbQ",

  authDomain: "tripadvisor-abc.firebaseapp.com",

  databaseURL: "https://tripadvisor-abc.firebaseio.com",
  projectId: "tripadvisor-abc",
  storageBucket: "tripadvisor-abc.appspot.com",
  messagingSenderId: "385058100845",
  appId: "1:385058100845:web:e14c078e62560948f99164",
  measurementId: "G-WJKPTNBC2F",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

// provider.setCustomParameters({
//   prompt: "select_account"
// });
// export const signInWithGoogle = () =>
//   firebase
//     .initializeApp(firebaseConfig)
//     .auth()
//     .signInWithPopup(provider);
export default firebase;
