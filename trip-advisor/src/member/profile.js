import React from "react";
import firebase from "../firebase";
import styles from "../scss/profile.module.scss";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faUser } from "@fortawesome/free-solid-svg-icons";

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
      document.querySelector("nav").style.backgroundColor = "white";
      document.querySelector("nav").style.boxShadow =
        "0 0 8px rgba(0, 0, 0, 0.2)";
      document.getElementById("MainTitle").style.color = "rgb(138, 134, 134)";
    }
    let btn = document.querySelectorAll(".btn");
    btn[0].classList.add(styles.start);

    btn.forEach((item, i) => {
      item.addEventListener("click", () => started(i));
    });
    function started(i) {
      btn.forEach((item, j) => {
        if (i === j) {
          item.classList.add(styles.start);
        } else {
          item.classList.remove(styles.start);
        }
      });
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
    document.getElementById("loading").style.display = "flex";
    document.getElementById("loading").style.backgroundColor = "white";
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
                    <div className={styles.buttons1}>
                      <button className="btn" onClick={this.handleMiddle}>
                        <span></span>
                        <p data-title="旅行中"></p>
                      </button>
                    </div>
                    <div className={styles.buttons2}>
                      <button className="btn" onClick={this.handlePrev}>
                        <span></span>
                        <p data-title="待出發"></p>
                      </button>
                    </div>
                    <div className={styles.buttons3}>
                      <button className="btn" onClick={this.handlePast}>
                        <span></span>
                        <p data-title="回憶錄"></p>
                      </button>
                    </div>
                  </ul>
                  {/* <button className={styles.logOut} onClick={this.signOut}>
                    <p>登出</p>
                  </button> */}
                  <div className={styles.buttonsLogout}>
                    <button className="btn" onClick={this.signOut}>
                      <span></span>
                      <p data-title="登出"></p>
                    </button>
                  </div>
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
