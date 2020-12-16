import React from "react";
import firebase from "../firebase";
import styles from "../scss/member.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faEnvelope,
  faLock,
  faUserPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import googleIcon from "../image/google-icon-10.png";

class MemberIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginState: true,
      email: "",
      password: "",
      displayName: "",
    };
  }

  componentDidMount() {
    console.log(window.location.pathname.substring(1, 9));
    if (window.location.pathname.substring(1, 9) === "member") {
      document.querySelectorAll("svg").forEach((item) => {
        item.style.color = "rgb(138, 134, 134)";
      });
      document.querySelectorAll("a").forEach((item) => {
        item.style.color = "rgb(138, 134, 134)";
      });
      document.querySelector("nav").style.backgroundColor = "white";
      document.querySelector("nav").style.boxShadow =
        "0 0 8px rgba(0, 0, 0, 0.2)";
    }
  }
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

  nativeSignUp = () => {
    let firestore = firebase.firestore();
    let auth = firebase.auth();
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        const createAt = new Date();
        firestore.collection("schedule").doc(auth.currentUser.uid).set({
          displayName: this.state.displayName,
          createAt: createAt,
          email: auth.currentUser.email,
          userID: auth.currentUser.uid,
        });
      });
  };

  handleLoginChange = () => {
    if (this.state.loginState) {
      this.setState({
        loginState: false,
      });
    } else {
      this.setState({
        loginState: true,
      });
    }
  };

  handleNameChange = (e) => {
    this.setState({
      displayName: e.target.value,
    });
  };
  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  render() {
    return (
      <div className={styles.member}>
        <div className={styles.wrap}>
          <div className={styles.loginContainer}>
            <div className={styles.image}>
              <div className={styles.layer}></div>
            </div>
            <div className={styles.panel}>
              {/* <div
                className={
                  this.state.loginState ? styles.layer : styles.layerchangeState
                }
              ></div> */}
              <div
                className={
                  this.state.loginState ? styles.loginPanel : styles.changeState
                }
              >
                <div className={styles.title}>
                  <h3>
                    <FontAwesomeIcon icon={faSignInAlt} />
                    登入
                  </h3>
                </div>
                <div className={styles.container}>
                  <div className={styles.signinTitle}>
                    <p>登入後可使用完整功能</p>
                  </div>
                  <div className={styles.signinItem}>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input
                      type="email"
                      id="sign-in-email"
                      placeholder="信箱"
                      value=""
                    />
                  </div>

                  <div className={styles.signinItem}>
                    <FontAwesomeIcon icon={faLock} />
                    <input
                      type="passwort"
                      id="sign-in-email"
                      placeholder="密碼"
                      value=""
                    />
                  </div>
                  <div className={styles.alert}>歡迎</div>
                  <button id="signInBtn" className={styles.btn}>
                    登入
                  </button>
                </div>
                <div className={styles.changeSingup}>
                  <p>還不是會員嗎？</p>
                  <button onClick={this.handleLoginChange}>
                    立刻註冊新帳號
                  </button>
                </div>
                <div className={styles.divider}>
                  <span></span>
                  <p>使用社群登入</p>
                  <span></span>
                </div>
                <div className={styles.socialSignin} onClick={this.googleLogin}>
                  <img src={googleIcon} alt="google-icon" />
                  <p>Google 登入</p>
                </div>
              </div>

              <div
                className={
                  this.state.loginState
                    ? styles.changeState
                    : styles.signupPanel
                }
              >
                <div className={styles.title}>
                  <h3>
                    <FontAwesomeIcon icon={faUserPlus} />
                    註冊
                  </h3>
                </div>
                <div className={styles.container}>
                  <div className={styles.signinItem}>
                    <FontAwesomeIcon icon={faUser} />
                    <input
                      type="text"
                      id="sign-up-name"
                      placeholder="姓名"
                      onChange={(e) => this.handleNameChange(e)}
                      value={this.state.displayName}
                    />
                  </div>
                  <div className={styles.signinItem}>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input
                      type="email"
                      id="sign-up-email"
                      placeholder="信箱"
                      onChange={(e) => this.handleEmailChange(e)}
                      value={this.state.email}
                    />
                  </div>

                  <div className={styles.signinItem}>
                    <FontAwesomeIcon icon={faLock} />
                    <input
                      type="password"
                      id="sign-up-password"
                      placeholder="密碼"
                      onChange={(e) => this.handlePasswordChange(e)}
                      value={this.state.password}
                    />
                  </div>
                  <div className={styles.alert}>歡迎</div>
                  <button id="signUpBtn" className={styles.btn}>
                    註冊
                  </button>
                </div>
                <div className={styles.changeSingup}>
                  <p>已經是會員嗎？</p>
                  <button onClick={this.handleLoginChange}>立刻登入</button>
                </div>
                <div className={styles.divider}>
                  <span></span>
                  <p>使用社群登入</p>
                  <span></span>
                </div>
                <div className={styles.socialSignin} onClick={this.googleLogin}>
                  <img src={googleIcon} alt="google-icon" />
                  <p>Google 登入</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/* <button onClick={this.googleSignOut}>Log Out</button> */
// MemberIndex.propTypes = {
//   history: PropTypes.object.isRequired
// };

export default MemberIndex;
