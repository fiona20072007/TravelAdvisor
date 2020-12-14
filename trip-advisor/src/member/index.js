import React from "react";
import firebase from "../firebase";
// import AsyncSelect from "react-select/async";
// import LocationShow from "./locationShow";
import styles from "../scss/member.module.scss";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import { signInWithGoogle } from "../firebase";

// const db = firebase.firestore();

class MemberIndex extends React.Component {
  //   constructor(props) {
  //     super(props);

  //     this.state = {
  //       // value: "",
  //       selectedTag: [],
  //       indexLocation: []
  //     };
  //   }
  googleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        console.log(token, user);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  googleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
        console.log("signout success");
      })
      .catch(function (error) {
        // An error happened.
        console.log(error);
      });
  };

  render() {
    return (
      <div className={styles.member}>
        {/* <div className={styles.navBar}>三</div> */}
        {/* <div className={styles.navBarList}>
          <Link to="/">Home</Link>
          <Link to="/schedule">行程規劃</Link>
          <Link to="/member">會員登入</Link>
        </div> */}
        <div className={styles.banner}></div>
        <div className={styles.title}>會員登入</div>
        <div>
          <div>帳號</div>
          <input></input>
          <div>密碼</div>
          <input></input>
        </div>
        <button onClick={this.googleLogin}>Continue with Google</button>
        <button onClick={this.googleSignOut}>Log Out</button>
      </div>
    );
  }
}

// MemberIndex.propTypes = {
//   history: PropTypes.object.isRequired
// };

export default MemberIndex;
