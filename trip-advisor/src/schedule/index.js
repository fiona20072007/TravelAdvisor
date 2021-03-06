import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import AddSchedule from "./AddSchedule";
import EditSchedule from "./EditSchedule";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Route,
  Link,
  useRouteMatch,
  useLocation,
  useHistory,
} from "react-router-dom";
import { setNavbarColor, deleteTravel } from "../Utils";

const db = firebase.firestore();

const ScheduleIndex = () => {
  const { path, url } = useRouteMatch();
  const [TravelSchedule, setTravelSchedule] = useState([]);
  const [TravelScheduleShow, setTravelScheduleShow] = useState([]);
  const [TravelId, setTravelId] = useState(null);
  const [ScheduleStatus, setScheduleStatus] = useState(true);
  const [userUid, setUserUid] = useState("");
  const [clickNav, setClickNav] = useState(0);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteShowId, setDeleteShowId] = useState(null);

  const location = useLocation();
  const history = useHistory();
  const travelShow = location.pathname.charAt(location.pathname.length - 1);

  const handleAll = () => {
    let arr = [...TravelSchedule];
    setTravelScheduleShow(arr);
    setScheduleStatus(true);
    setTravelId(null);
    setClickNav(0);
  };
  const handleAdd = () => {
    setScheduleStatus(false);
    setTravelId(null);
    setClickNav(0);
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
  };

  const handleDeleteSchedule = (id) => {
    let arr = TravelSchedule.filter((item) => {
      return item.id !== id;
    });
    setTravelSchedule(arr);
    setTravelScheduleShow(arr);
    deleteTravel(userUid, id);
  };

  useEffect(() => {
    setNavbarColor("schedule");

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserUid(user.uid);
        db.collection("schedule")
          .doc(user.uid)
          .collection("data")
          .onSnapshot((querySnapshot) => {
            let TravelScheduleTemp = [];
            querySnapshot.forEach((doc) => {
              TravelScheduleTemp.push(doc.data());
            });

            setTravelSchedule(TravelScheduleTemp);
            setTravelScheduleShow(TravelScheduleTemp);
          });
      } else {
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
                handleAll();
              }}
            >
              <Link to="/schedule">所有行程</Link>
            </li>
            <li
              className={ScheduleStatus ? styles.liUnclick : styles.liClick}
              onClick={() => {
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
                        onMouseOver={() => {
                          setDeleteShowId(item.id);
                          setDeleteShow(true);
                        }}
                        onMouseLeave={() => setDeleteShow(false)}
                        onClick={(e) => {
                          if (
                            e.target.tagName === "DIV" ||
                            e.target.tagName === "IMG"
                          ) {
                            setTravelId(item.id);
                            document.getElementById("loading").style.display =
                              "flex";
                            document.getElementById(
                              "loading"
                            ).style.backgroundColor = "white";
                            history.push(`${url}/editSchedule/${item.id}`);
                          }
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
                        <div
                          id={item.id}
                          className={
                            deleteShow && item.id === deleteShowId
                              ? styles.deleteSchedule
                              : styles.deleteScheduleHide
                          }
                          onClick={(e) => {
                            if (
                              e.target.tagName === "svg" ||
                              e.target.tagName === "path"
                            ) {
                              handleDeleteSchedule(item.id);
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
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

        {ScheduleStatus === false && (
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

export default React.memo(ScheduleIndex);
