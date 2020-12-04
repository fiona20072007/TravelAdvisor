import React from "react";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import DropSchedule from "./DropSchedule";
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
  onDragStart = (result) => {
    // console.log(result);
    const { draggableId } = result;

    if (draggableId.substr(0, 1) === "I") {
      // let travelMorningTemp = [];
      let travelMorningAllTemp = {};

      // db.collection("schedule")
      //   .doc("userId")
      //   .collection("data")
      //   .doc(`travel${this.state.travelShowId}`)
      //   .collection("dateBlockDetail")
      //   .doc(source.droppableId.substring(5))
      //   .get()
      //   .then(doc => {
      //     travelMorningTemp = Array.from(doc.data().morning);
      //     console.log("travelMorningTemp = ", travelMorningTemp);
      //     this.setState({ travelMorning: travelMorningTemp });
      //   });

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
          console.log("travelMorningAllTemp", travelMorningAllTemp);
        });
    }
  };

  onDragEnd = (result) => {
    console.log(result);
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
        // let travelMorningDragTemp = [];
        // let travelMorningDropTemp = [];
        // let dragObj = {
        //   country: this.state.travelMorningAllTemp[
        //     source.draggableId.substring(5)
        //   ].country,
        //   id: draggableId.substring(3)
        // };
        // source.droppableId.substring(5)
        let travelMorningTemp = [];
        console.log(
          this.state.travelMorningAll[source.droppableId.substring(5)]
        );
        travelMorningTemp = Array.from(
          this.state.travelMorningAll[source.droppableId.substring(5)]
        );
        const [remove] = travelMorningTemp.splice(source.index, 1);

        travelMorningTemp.splice(destination.index, 0, remove);
        this.setState({ travelMorning: travelMorningTemp });
        console.log("Morning", travelMorningTemp);

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
    }
  };

  render() {
    // console.log("travelData", this.state.travelData);
    return (
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
                <img className={styles.schedulePhoto} src={item.CoverImgUrl} />
              </div>
            </div>
          );
        })}
        <DragDropContext
          onDragEnd={this.onDragEnd}
          onDragStart={this.onDragStart}
        >
          {this.state.travelData.map((item, i) => {
            return <DropSchedule key={i} items={item.dateBlock} />;
          })}
        </DragDropContext>
      </div>
    );
  }
}

EditSchedule.propTypes = {
  travelShow: PropTypes.number,
};

export default EditSchedule;
