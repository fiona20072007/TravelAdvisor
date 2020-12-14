import React from "react";
// import firebase from "../firebase";
// import AsyncSelect from "react-select/async";
// import LocationShow from "./locationShow";
import styles from "../scss/member.module.scss";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import { signInWithGoogle } from "../firebase";

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
        <button onClick={signInWithGoogle}>Continue with Google</button>
      </div>
    );
  }
}

// MemberIndex.propTypes = {
//   history: PropTypes.object.isRequired
// };

export default MemberIndex;
