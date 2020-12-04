import React from "react";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
// import FindLocation from "./FindLocation";
import DropSchedule from "./DropSchedule";
import { DragDropContext } from "react-beautiful-dnd";

const db = firebase.firestore();

class EditSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      travelData: [],
      isLoading: true,
      dateBlock: "",
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
    const column = this.state.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newColumn.id]: newColumn,
      },
    };
    this.setState(newState);
  };

  render() {
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
