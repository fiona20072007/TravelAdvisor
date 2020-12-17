import React from "react";
import firebase from "../firebase";
import styles from "../scss/profile.module.scss";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCocktail,
  faSuitcase,
  faPassport,
  faPlane,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const db = firebase.firestore();
const auth = firebase.auth();
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      photoUrl: "",
      uid: "",
      schedule: [],
      scheduleShow: [],
      title: "旅行中",
    };
  }
  componentDidMount = () => {
    // let user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("sign in success");
        let url = "";
        if (user.photoURL !== "") {
          url = user.photoURL;
        }
        this.setState({
          name: auth.currentUser.displayName,
          email: user.email,
          photoUrl: url,
          uid: user.uid,
        });

        let arr = [];

        db.collection("schedule")
          .doc(user.uid)
          .collection("data")
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
              let obj = {};
              obj["StartDate"] = doc.data().StartDate;
              obj["EndDate"] = doc.data().EndDate;
              obj["CoverImgUrl"] = doc.data().CoverImgUrl;
              obj["TravelScheduleName"] = doc.data().TravelScheduleName;
              obj["StartDateStamp"] = doc.data().StartDateStamp;
              obj["EndDateStamp"] = doc.data().EndDateStamp;
              obj["id"] = doc.data().id;
              arr.push(obj);
            });
            console.log(arr);
            let time = Date.now();
            let newArr = arr.filter((item) => {
              return item.StartDateStamp <= time && time <= item.EndDateStamp;
            });

            this.setState({
              schedule: arr,
              scheduleShow: newArr,
            });
          });
      } else {
        this.props.history.push(`/member`);
      }
    });

    if (window.location.pathname.substring(1, 9) === "profile") {
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
  };
  signOut = () => {
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
  handleMiddle = () => {
    let arr = [...this.state.schedule];
    let time = Date.now();
    let newArr = arr.filter((item) => {
      return item.StartDateStamp <= time && time <= item.EndDateStamp;
    });
    this.setState({
      scheduleShow: newArr,
      title: "旅行中",
    });
  };
  handlePrev = () => {
    let arr = [...this.state.schedule];
    let time = Date.now();
    let newArr = arr.filter((item) => {
      return item.StartDateStamp >= time;
    });
    this.setState({
      scheduleShow: newArr,
      title: "待出發",
    });
  };
  handlePast = () => {
    let arr = [...this.state.schedule];
    let time = Date.now();
    let newArr = arr.filter((item) => {
      return item.EndDateStamp <= time;
    });
    this.setState({
      scheduleShow: newArr,
      title: "回憶錄",
    });
  };
  handleNavigate(id) {
    this.props.history.push(`/schedule/editSchedule/${id}`);
  }

  render() {
    return (
      <div className={styles.profile}>
        <div className={styles.wrap}>
          <div className={styles.profileLeft}>
            <div className={styles.pad}>
              <div className={styles.user}>
                <div className={styles.userImg}>
                  {this.state.photoUrl !== null && (
                    <img src={this.state.photoUrl} alt="user photo" />
                  )}
                  {this.state.photoUrl === null && (
                    <FontAwesomeIcon icon={faUser} />
                  )}
                </div>
                <div className={styles.userName}>{this.state.name}</div>
                <div className={styles.userEmail}>{this.state.email}</div>
                <div className={styles.userList}>
                  <ul>
                    <li onClick={this.handleMiddle}>
                      <FontAwesomeIcon icon={faCocktail} />
                      旅行中
                    </li>
                    <li onClick={this.handlePrev}>
                      <FontAwesomeIcon icon={faSuitcase} />
                      待出發
                    </li>
                    <li onClick={this.handlePast}>
                      <FontAwesomeIcon icon={faPassport} />
                      回憶錄
                    </li>
                  </ul>
                  <button className={styles.logOut} onClick={this.signOut}>
                    <p>登出</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.profileRight}>
            <div className={styles.listTitle}>{this.state.title}</div>
            <div className={styles.travelNumber}>
              <div>
                目前共有
                <span className={styles.travelNum}>
                  {this.state.scheduleShow.length}
                </span>
                個行程
              </div>
            </div>
            <div className={styles.nowTravelList}>
              {this.state.scheduleShow.map((item, i) => {
                return (
                  <div
                    className={styles.nowTravelListDetail}
                    onClick={() => {
                      this.handleNavigate(item.id);
                    }}
                    key={i}
                  >
                    <div className={styles.travelTitle}>
                      {item.TravelScheduleName}
                    </div>
                    <div className={styles.travelDateAll}>
                      <div className={styles.travelDate}>{item.StartDate}</div>
                      <FontAwesomeIcon icon={faPlane} />
                      <div className={styles.travelDate}>{item.EndDate}</div>
                    </div>
                    <img src={item.CoverImgUrl} alt="tarvel cover image" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Profile;
