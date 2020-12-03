import React from "react";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import moment from "moment";
import FindLocation from "./FindLocation";

const db = firebase.firestore();

class EditSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      travelData: [],
    };
  }

  componentDidMount() {
    let travelShowId = window.location.pathname.substring(23);
    let travelDataTemp = [];
    db.collection("schedule")
      .doc("userId")
      .collection("data")
      .doc(`travel${travelShowId}`)
      .get()
      .then((doc) => {
        travelDataTemp.push(doc.data());
        this.setState({ travelData: travelDataTemp });
      });
  }

  travelDayHandle(start, end) {
    const dateTemp = [];
    let n = 1;
    for (let i = start; i < end + 1; i += 86400000) {
      dateTemp.push(
        <div
          className={styles.dayBlockAll}
          onClick={() => {
            console.log(123);
          }}
        >
          <div>
            Day-{n}, {moment(i).format("MM-DD-YYYY")}
          </div>
          <div className={styles.dayBlock}>
            <div>123</div>
          </div>
        </div>
      );
      n += 1;
    }
    return dateTemp;
  }

  render() {
    return (
      <div className={styles.scheduleAll}>
        {this.state.travelData.map((item) => {
          return (
            <div key={item.id} className={styles.scheduleListAll}>
              <div
                className={styles.scheduleList}
                onClick={() => {
                  console.log(123);
                }}
              >
                <div className={styles.scheduleTitle}>
                  {item.TravelScheduleName}
                </div>
                <div className={styles.date}>
                  {item.StartDate} ～ {item.EndDate}
                </div>
                <img className={styles.schedulePhoto} src={item.CoverImgUrl} />
              </div>
              <div className={styles.dayDetail}>
                {this.travelDayHandle(
                  this.state.travelData[0].StartDateStamp,
                  this.state.travelData[0].EndDateStamp
                )}
              </div>
            </div>
          );
        })}
        <div className={styles.scheduleListAll}>
          <FindLocation />
        </div>
      </div>
    );
  }
}

EditSchedule.propTypes = {
  travelShow: PropTypes.number,
};

export default EditSchedule;
