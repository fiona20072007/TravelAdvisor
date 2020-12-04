import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import AddSchedule from "./AddSchedule";
import EditSchedule from "./EditSchedule";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import { Route, Link, useRouteMatch, useLocation } from "react-router-dom";

const db = firebase.firestore();

const ScheduleIndex = (props) => {
  const { path, url } = useRouteMatch();
  const [TravelSchedule, setTravelSchedule] = useState([]);
  const [TravelId, setTravelId] = useState(null);
  let location = useLocation();
  let travelShow = location.pathname.charAt(location.pathname.length - 1);
  // const addNewTravel = newTravel => {
  //   setTravelSchedule([...TravelSchedule, newTravel]);
  // };

  useEffect(() => {
    db.collection("schedule")
      .doc("userId")
      .collection("data")
      .onSnapshot((querySnapshot) => {
        let TravelScheduleTemp = [];
        querySnapshot.forEach((doc) => {
          TravelScheduleTemp.push(doc.data());
        });
        setTravelSchedule(TravelScheduleTemp);
      });
  }, []);

  return (
    <div className={styles.scheduleLayout}>
      <ul className={styles.scheduleNav}>
        <li onClick={() => setTravelId(null)}>
          <Link to={`${url}/addSchedule`}>新增行程</Link>
        </li>
        <li onClick={() => setTravelId(null)}>
          <Link to="/schedule">所有行程</Link>
        </li>
      </ul>
      <div className={styles.scheduleListRange}>
        {TravelId === null && travelShow == "e" && (
          <div className={styles.scheduleListDetail}>
            {TravelSchedule.map((item) => {
              return (
                <div key={item.id} id={item.id}>
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
                      {item.StartDate} ～ {item.EndDate}
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
        )}

        <div>
          <Route path={`${path}/addSchedule`} component={AddSchedule}></Route>
          <Route
            path={`${path}/editSchedule/:travelShow`}
            component={EditSchedule}
          ></Route>
        </div>
      </div>
    </div>
  );
};

ScheduleIndex.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ScheduleIndex;
