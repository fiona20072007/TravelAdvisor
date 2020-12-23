import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import AddSchedule from "./AddSchedule";
import EditSchedule from "./EditSchedule";

import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";
import {
  Route,
  Link,
  useRouteMatch,
  useLocation,
  useHistory,
} from "react-router-dom";

const db = firebase.firestore();

const ScheduleIndex = (props) => {
  const { path, url } = useRouteMatch();
  const [TravelSchedule, setTravelSchedule] = useState([]);
  const [TravelScheduleShow, setTravelScheduleShow] = useState([]);
  const [TravelId, setTravelId] = useState(null);
  const [ScheduleStatus, setScheduleStatus] = useState(true);
  const [AddScheduleStatus, setAddScheduleStatus] = useState(false);
  const [userUid, setUserUid] = useState("");
  const [clickNav, setClickNav] = useState(0);

  let location = useLocation();
  let history = useHistory();
  let travelShow = location.pathname.charAt(location.pathname.length - 1);
  // const addNewTravel = newTravel => {
  //   setTravelSchedule([...TravelSchedule, newTravel]);
  // };
  const handleAll = () => {
    let arr = [...TravelSchedule];
    setTravelScheduleShow(arr);
    setScheduleStatus(true);
    setAddScheduleStatus(false);
  };
  const handleAdd = () => {
    setScheduleStatus(false);
    setAddScheduleStatus(true);
  };

  const handleMiddle = () => {
    let arr = [...TravelSchedule];
    let time = Date.now();
    let newArr = arr.filter((item) => {
      return item.StartDateStamp <= time && time <= item.EndDateStamp;
    });

    setTravelScheduleShow(newArr);
    setClickNav(1);
  };
  const handlePrev = () => {
    let arr = [...TravelSchedule];
    let time = Date.now();
    let newArr = arr.filter((item) => {
      return item.StartDateStamp >= time;
    });
    setTravelScheduleShow(newArr);
    setClickNav(2);
  };
  const handlePast = () => {
    let arr = [...TravelSchedule];
    let time = Date.now();
    let newArr = arr.filter((item) => {
      return item.EndDateStamp <= time;
    });
    setTravelScheduleShow(newArr);
    setClickNav(3);
  };

  const handleSubmitChange = () => {
    setScheduleStatus(true);
    setAddScheduleStatus(false);
  };

  useEffect(() => {
    if (window.location.pathname.substring(1, 9) === "schedule") {
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

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("sign in success");
        setUserUid(user.uid);
        db.collection("schedule")
          .doc(user.uid)
          .collection("data")
          .onSnapshot((querySnapshot) => {
            let TravelScheduleTemp = [];
            querySnapshot.forEach((doc) => {
              TravelScheduleTemp.push(doc.data());
            });
            console.log(TravelScheduleTemp);
            setTravelSchedule(TravelScheduleTemp);
            setTravelScheduleShow(TravelScheduleTemp);
          });
      } else {
        alert("請先登入");
        history.push("/member");
      }
    });
  }, []);

  return (
    <div className={styles.scheduleLayout}>
      <div className={styles.scheduleListRange} id="scheduleListRange">
        <div className={styles.scheduleNavMain}>
          <ul className={styles.Nav}>
            <li
              className={ScheduleStatus ? styles.liClick : styles.liUnclick}
              onClick={() => {
                setTravelId(null);
                handleAll();
              }}
            >
              <Link to="/schedule">所有行程</Link>
            </li>
            <li
              className={AddScheduleStatus ? styles.liClick : styles.liUnclick}
              onClick={() => {
                setTravelId(null);
                setClickNav(0);
                handleAdd();
              }}
            >
              <Link to={`${url}/addSchedule`}>新增行程</Link>
            </li>
          </ul>
        </div>
        {TravelId === null && travelShow == "e" && ScheduleStatus === true && (
          <div className={styles.scheduleListAll}>
            <div className={styles.userList}>
              <div className={styles.border}>
                <a
                  onClick={handleMiddle}
                  className={
                    clickNav === 1
                      ? styles.userListClick
                      : styles.userListUnclick
                  }
                >
                  旅行中
                </a>
                <a
                  onClick={handlePrev}
                  className={
                    clickNav === 2
                      ? styles.userListClick
                      : styles.userListUnclick
                  }
                >
                  待出發
                </a>
                <a
                  onClick={handlePast}
                  className={
                    clickNav === 3
                      ? styles.userListClick
                      : styles.userListUnclick
                  }
                >
                  回憶錄
                </a>
              </div>
            </div>
            <div className={styles.scheduleListDetail}>
              {TravelScheduleShow.slice(0)
                .reverse()
                .map((item) => {
                  return (
                    <div key={item.id} id={item.id} className={styles.All}>
                      {Date.now() - item.setDateStamp < 10800000 && (
                        <div className={styles.tag}>
                          <li>New</li>
                        </div>
                      )}
                      <div
                        className={styles.scheduleList}
                        onClick={() => {
                          setTravelId(item.id);
                          props.history.push(`${url}/editSchedule/${item.id}`);
                        }}
                      >
                        <div className={styles.scheduleTitle}>
                          {item.TravelScheduleName}
                        </div>
                        <div className={styles.date}>
                          <div className={styles.travelDate}>
                            {item.StartDate}
                          </div>
                          <FontAwesomeIcon icon={faPlane} />
                          <div className={styles.travelDate}>
                            {" "}
                            {item.EndDate}
                          </div>
                        </div>
                        <img
                          className={styles.schedulePhoto}
                          src={item.CoverImgUrl}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {AddScheduleStatus === true && (
          <div className={styles.scheduleListAdd}>
            <Route
              path={`${path}/addSchedule`}
              component={() => (
                <AddSchedule
                  handleSubmitChange={handleSubmitChange}
                  userUid={userUid}
                />
              )}
            ></Route>
          </div>
        )}
      </div>
      <div className={styles.scheduleAll}>
        <Route
          path={`${path}/editSchedule/:travelShow`}
          component={EditSchedule}
        ></Route>
      </div>
    </div>
  );
};

ScheduleIndex.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ScheduleIndex;
