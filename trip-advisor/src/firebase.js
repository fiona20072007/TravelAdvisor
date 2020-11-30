import firebase from "firebase";

const firebaseConfig = {
  // API_HOST: "https://mickeyzone.online/api/1.0",
  // FACEBOOK_APP_ID: "700590737403665",
  // API_KEY: "AIzaSyBIPaKSL7L_BEuibcSXhCtV-7TwWaJ1cok",

  apiKey: "AIzaSyAupP8pk0usCtzryMeCkskkn_1OuE1s2mg",
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

export default firebase;
