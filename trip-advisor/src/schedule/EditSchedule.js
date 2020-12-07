import React from "react";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import DropSchedule from "./DropSchedule";
import ScheduleMap from "./ScheduleMap";

import { DragDropContext } from "react-beautiful-dnd";

const db = firebase.firestore();

class EditSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      travelData: [],
      travelShowId: null,
      travelMorning: [],
      travelMorningAll: {},
      searchCountry: "",
      searchCountryDetail: {},
    };
  }

  componentDidMount() {
    let travelShowId = window.location.pathname.substring(23);
    this.setState({ travelShowId: travelShowId });
    let travelDataTemp = [];

    db.collection("schedule")
      .doc("userId")
      .collection("data")
      .doc(`travel${travelShowId}`)
      .onSnapshot(
        (doc) => {
          travelDataTemp.push(doc.data());
          this.setState({ travelData: travelDataTemp });
        }

        // .get()
        // .then(doc => {
        //   travelDataTemp.push(doc.data());
        //   this.setState({ travelData: travelDataTemp });
      );
  }

  getCountry = (country) => {
    this.setState({ searchCountry: country });
  };

  onDragStart = (result) => {
    const { draggableId } = result;

    let travelMorningAllTemp = {};

    db.collection("schedule")
      .doc("userId")
      .collection("data")
      .doc(`travel${this.state.travelShowId}`)
      .collection("dateBlockDetail")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          travelMorningAllTemp[doc.data().name] = doc.data().morning;
        });
        this.setState({ travelMorningAll: travelMorningAllTemp });
      });

    if (draggableId.substr(0, 1) === "i") {
      db.collection("country")
        .doc(this.state.searchCountry)
        .collection("location")
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            if (doc.data().id === draggableId.substring(3)) {
              let obj = {
                country: this.state.searchCountry,
                id: doc.data().id,
                pos: {
                  lat: parseFloat(doc.data().latitude),
                  lng: parseFloat(doc.data().longitude),
                },
              };

              this.setState({
                searchCountryDetail: obj,
              });
            }
          });
        });
    }
  };

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      console.log("no destination");
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (draggableId.substr(0, 1) === "I") {
      if (
        destination.droppableId === source.droppableId &&
        destination.index !== source.index
      ) {
        let travelMorningTemp = [];

        travelMorningTemp = Array.from(
          this.state.travelMorningAll[source.droppableId.substring(5)]
        );
        const [remove] = travelMorningTemp.splice(source.index, 1);

        travelMorningTemp.splice(destination.index, 0, remove);
        this.setState({ travelMorning: travelMorningTemp });

        db.collection("schedule")
          .doc("userId")
          .collection("data")
          .doc(`travel${this.state.travelShowId}`)
          .collection("dateBlockDetail")
          .doc(destination.droppableId.substring(5))
          .set({
            morning: travelMorningTemp,
            name: destination.droppableId.substring(5),
          });
      } else {
        let travelMorningDragTemp = [];
        let travelMorningDropTemp = [];
        travelMorningDragTemp = Array.from(
          this.state.travelMorningAll[source.droppableId.substring(5)]
        );
        travelMorningDropTemp = Array.from(
          this.state.travelMorningAll[destination.droppableId.substring(5)]
        );
        const [remove] = travelMorningDragTemp.splice(source.index, 1);
        travelMorningDropTemp.splice(destination.index, 0, remove);

        db.collection("schedule")
          .doc("userId")
          .collection("data")
          .doc(`travel${this.state.travelShowId}`)
          .collection("dateBlockDetail")
          .doc(source.droppableId.substring(5))
          .set({
            morning: travelMorningDragTemp,
            name: source.droppableId.substring(5),
          });

        db.collection("schedule")
          .doc("userId")
          .collection("data")
          .doc(`travel${this.state.travelShowId}`)
          .collection("dateBlockDetail")
          .doc(destination.droppableId.substring(5))
          .set({
            morning: travelMorningDropTemp,
            name: destination.droppableId.substring(5),
          });
      }
    }

    if (draggableId.substr(0, 1) === "i") {
      let travelMorningTemp = [];

      travelMorningTemp = Array.from(
        this.state.travelMorningAll[destination.droppableId.substring(5)]
      );

      travelMorningTemp.splice(
        destination.index,
        0,
        this.state.searchCountryDetail
      );
      this.setState({ travelMorning: travelMorningTemp });

      db.collection("schedule")
        .doc("userId")
        .collection("data")
        .doc(`travel${this.state.travelShowId}`)
        .collection("dateBlockDetail")
        .doc(destination.droppableId.substring(5))
        .set({
          morning: travelMorningTemp,
          name: destination.droppableId.substring(5),
        });
    }
  };

  render() {
    return (
      <div className={styles.scheduleWithMap}>
        <div className={styles.scheduleAll}>
          {this.state.travelData.map((item) => {
            return (
              <div key={item.id} className={styles.scheduleListAll}>
                <div className={styles.scheduleList}>
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
          <DragDropContext
            onDragEnd={this.onDragEnd}
            onDragStart={this.onDragStart}
          >
            {this.state.travelData.map((i) => {
              return <DropSchedule key={i} getCountry={this.getCountry} />;
            })}
          </DragDropContext>
        </div>
        <div className={styles.scheduleMap}>
          <ScheduleMap />
        </div>
      </div>
    );
  }
}

EditSchedule.propTypes = {
  travelShow: PropTypes.number,
};

export default EditSchedule;
