import React from "react";
import PropTypes from "prop-types";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import anime from "animejs/lib/anime.es.js";
import { getTravelTitleDetail, setSchedule } from "../Utils";

const db = firebase.firestore();

class AddSchedule extends React.PureComponent {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      value: "",
      focusedInput: "",
      startDate: "",
      endDate: "",
      startDateStamp: null,
      endDateStamp: null,
      date: "",
      startDateSubmit: "",
      endDateSubmit: "",
      totalDay: "",
      size: null,
      dateBlock: [],
    };
  }
  componentDidMount() {
    db.collection("schedule")
      .doc(this.props.userUid)
      .collection("data")
      .get()
      .then((snap) => {
        this.setState({
          size: snap.size,
        });
      });

    anime
      .timeline({ loop: 1 })
      .add({
        targets: document.getElementById("line1"),
        opacity: [0.5, 1],
        scaleX: [0, 1],
        easing: "easeInOutExpo",
        duration: 700,
      })
      .add({
        targets: document.getElementById("line2"),
        opacity: [0.5, 1],
        scaleX: [0, 1],
        easing: "easeInOutExpo",
        duration: 50,
      })
      .add({
        targets: document.getElementById("line1"),
        duration: 600,
        easing: "easeOutExpo",
        translateY: -1 + 0 + "em",
      });

    anime
      .timeline({ loop: 1 })
      .add({
        targets: document.getElementById("line1"),
        opacity: [0.5, 1],
        scaleX: [0, 1],
        easing: "easeInOutExpo",
        duration: 700,
      })
      .add({
        targets: document.getElementById("line2"),
        opacity: [0.5, 1],
        scaleX: [0, 1],
        easing: "easeInOutExpo",
        duration: 50,
      })

      .add({
        targets: document.getElementById("line2"),
        duration: 600,
        easing: "easeOutExpo",
        translateY: -1 + 1 * 2 * 1 + "em",
      });

    anime
      .timeline({ loop: 1 })
      .add({
        targets: document.getElementById("line1"),
        opacity: [0.5, 1],
        scaleX: [0, 1],
        easing: "easeInOutExpo",
        duration: 700,
      })
      .add({
        targets: document.getElementById("line2"),
        opacity: [0.5, 1],
        scaleX: [0, 1],
        easing: "easeInOutExpo",
        duration: 50,
      })

      .add({
        targets: "#ampersand",
        opacity: [0, 1],
        scaleY: [0.5, 1],
        easing: "easeOutExpo",
        duration: 600,
        offset: "-=600",
      })
      .add({
        targets: document.getElementById("lettersLeft"),
        opacity: [0, 1],
        translateX: ["0.5em", 0],
        easing: "easeOutExpo",
        duration: 600,
        offset: "-=300",
      });
    anime
      .timeline({ loop: 1 })
      .add({
        targets: document.getElementById("line1"),
        opacity: [0.5, 1],
        scaleX: [0, 1],
        easing: "easeInOutExpo",
        duration: 700,
      })
      .add({
        targets: document.getElementById("line2"),
        opacity: [0.5, 1],
        scaleX: [0, 1],
        easing: "easeInOutExpo",
        duration: 50,
      })

      .add({
        targets: "#ampersand",
        opacity: [0, 1],
        scaleY: [0.5, 1],
        easing: "easeOutExpo",
        duration: 600,
        offset: "-=600",
      })
      .add({
        targets: document.getElementById("lettersRight"),
        opacity: [0, 1],
        translateX: ["-0.5em", 0],
        easing: "easeOutExpo",
        duration: 600,
        offset: "-=600",
      });
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = (event) => {
    let date = Date.now();
    event.preventDefault();
    getTravelTitleDetail(this.props.userUid, this.state.size).set({
      CoverImgUrl: "https://imgs.gvm.com.tw/upload/gallery/oimg26/26478_01.jpg",
      EndDate: this.state.endDateSubmit,
      EndDateStamp: this.state.endDateStamp,
      ImMultiEditMember: false,
      ShareLink: "",
      StartDate: this.state.startDateSubmit,
      StartDateStamp: this.state.startDateStamp,
      TotalDay: this.state.totalDay,
      TravelScheduleDetailInfos: [],
      TravelScheduleName: this.state.value,
      comment: "",
      id: this.state.size,
      dateBlock: this.state.dateBlock,
      setDateStamp: date,
    });
    for (let i = 0; i < this.state.totalDay; i++) {
      setSchedule(
        this.props.userUid,
        this.state.size,
        this.state.dateBlock[i],
        []
      );
    }

    this.setState({ value: "" });
    this.props.handleSubmitChange();
  };

  onDatesChange = ({ startDate, endDate }) => {
    let startDateTemp = moment(startDate).format("MM/DD/YYYY");
    let endDateTemp = moment(endDate).format("MM/DD/YYYY");
    let throughTime = moment(endDateTemp) - moment(startDateTemp);
    let days = Math.floor(throughTime / (24 * 3600 * 1000)) + 1;
    let startDateStamp = moment(startDate).valueOf();
    let endDateStamp = moment(endDate).valueOf();
    const dateTemp = [];
    for (let i = startDateStamp; i < endDateStamp + 1; i += 86400000) {
      dateTemp.push(moment(i).format("MM-DD-YYYY"));
    }

    this.setState({
      startDate,
      startDateStamp,
      endDate,
      endDateStamp,
      startDateSubmit: startDateTemp,
      endDateSubmit: endDateTemp,
      totalDay: days,
      dateBlock: dateTemp,
    });
  };

  onFocusChange = (focusedInput) => {
    this.setState({ focusedInput });
  };
  handleDate = (e) => {
    this.setState({ date: e });
  };

  render() {
    return (
      <div className={styles.addSchedule}>
        <label className={styles.addScheduleLabel}>
          <h2 className={styles.ml5}>
            <span className={styles.textWrapper}>
              <span className={styles.line} id="line1"></span>
              <p className={styles.lettersLeft} id="lettersLeft">
                Plan
              </p>
              <p className={styles.ampersand} id="ampersand">
                &amp;
              </p>
              <p className={styles.lettersRight} id="lettersRight">
                Start
              </p>
              <span className={styles.line} id="line2"></span>
            </span>
          </h2>

          <div className={styles.titleInput}>
            <FontAwesomeIcon icon={faPlane} />
            <input
              type="text"
              value={this.state.value}
              placeholder="請輸入旅程名稱"
              onChange={this.handleChange}
            />
          </div>
          <div className={styles.dateInputAll}>
            <FontAwesomeIcon icon={faCalendarCheck} />
            <DateRangePicker
              withPortal
              autoFocus
              showClearDates
              startDatePlaceholderText="開始日期"
              endDatePlaceholderText="結束日期"
              monthFormat="YYYY[年]MM[月]"
              phrases={{ closeDatePicker: "關閉", clearDates: "清除日期" }}
              onDatesChange={this.onDatesChange}
              onFocusChange={this.onFocusChange}
              focusedInput={this.state.focusedInput}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onChange={this.handleDate}
              value={this.state.date}
            />
          </div>
          <div>{this.state.date}</div>
        </label>
        <div className={styles.wrapper}>
          <a className={styles.button} onClick={this.handleSubmit}>
            Submit!
          </a>
        </div>
      </div>
    );
  }
}

AddSchedule.propTypes = {
  history: PropTypes.object.isRequired,
  handleSubmitChange: PropTypes.func,
  userUid: PropTypes.string,
};

export default AddSchedule;
