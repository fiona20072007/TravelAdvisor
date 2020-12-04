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
    };
  }

  componentDidMount() {
    let travelShowId = window.location.pathname.substring(23);
    this.setState({ travelShowId: travelShowId });
    let travelDataTemp = [];
    //修改！onSnapShot
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

  onDragEnd = (result) => {
    console.log(result);
    const { destination, source, draggableId } = result;
    if (!destination) {
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

        db.collection("schedule")
          .doc("userId")
          .collection("data")
          .doc(`travel${this.state.travelShowId}`)
          .collection("dateBlockDetail")
          .doc(destination.droppableId.substring(5))
          .get()
          .then((doc) => {
            travelMorningTemp = [...doc.data().morning];
            let dragObj = {
              country: doc.data().morning[source.index].country,
              id: draggableId.substring(3),
            };
            travelMorningTemp.splice(source.index, 1);
            travelMorningTemp.splice(destination.index, 0, dragObj);
            // console.log(travelMorningTemp);
            this.setState({ travelMorning: travelMorningTemp });
            console.log(this.state.travelMorning);

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
          });
        // .then(
        //   console.log(this.state.travelMorning)

        // );
      }
    }

    // const column = this.state.columns[source.droppableId];
    // const newTaskIds = Array.from(column.taskIds);
    // newTaskIds.splice(source.index, 1);
    // newTaskIds.splice(destination.index, 0, draggableId);

    // const newColumn = {
    //   ...column,
    //   taskIds: newTaskIds
    // };
    // const newState = {
    //   ...this.state,
    //   columns: {
    //     ...this.state.columns,
    //     [newColumn.id]: newColumn
    //   }
    // };
    // this.setState(newState);
  };

  render() {
    console.log("travelData", this.state.travelData);
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
        <DragDropContext onDragEnd={this.onDragEnd}>
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
