import React from "react";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import FindLocation from "./FindLocation";
import { Droppable, Draggable } from "react-beautiful-dnd";

const db = firebase.firestore();

class DropSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      travelDateDetail: [],
      travelDetailCountry: {},
    };
  }

  componentDidMount() {
    let travelShowId = window.location.pathname.substring(23);

    let travelDateDetailTemp = [];

    db.collection("schedule")
      .doc("userId")
      .collection("data")
      .doc(`travel${travelShowId}`)
      .collection("dateBlockDetail")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          travelDateDetailTemp.push(doc.data());
        });
        this.setState({ travelDateDetail: travelDateDetailTemp });
        let travelDetailCountryTemp = {};

        travelDateDetailTemp.forEach((dates) => {
          let arr = [];
          return dates.morning.forEach((date) => {
            if (dates.morning.length !== 0) {
              db.collection("country")
                .doc(date.country)
                .collection("location")
                .onSnapshot((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    if (doc.data().id == date.id) {
                      arr.push(doc.data());
                    }
                  });
                  travelDetailCountryTemp[dates.name] = arr;
                  this.setState({
                    travelDetailCountry: travelDetailCountryTemp,
                  });
                });
            }
          });
        });
      });
  }

  handleDragBlock = (name) => {
    // console.log(
    //   "this.state.travelDetailCountry",
    //   this.state.travelDetailCountry
    // );
    console.log(this.state.travelDetailCountry);
    if (this.state.travelDetailCountry[name] === undefined) {
      return <div className={styles.emptyList}>Drop Here!</div>;
    } else {
      return this.state.travelDetailCountry[name].map((item, i) => {
        return (
          <Draggable draggableId={`Id-${item.id}`} index={i} key={item.id}>
            {(provided) => (
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                className={styles.itemList}
              >
                <img src={item.PointImgUrl} className={styles.itemPhoto}></img>
                <div className={styles.itemName}>{item.name}</div>
                <div>{item.star_level}</div>
              </div>
            )}
          </Draggable>
        );
      });
    }
  };

  render() {
    // console.log(this.state.travelDateDetail);
    return (
      <div className={styles.scheduleDateAll}>
        {this.state.travelDateDetail.map((item, i) => (
          <Droppable droppableId={`drop-${item.name}`} key={i}>
            {(provided) => (
              <div>
                <div
                  className={styles.scheduleDetail}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className={styles.scheduleDateOnly}>{item.name}</div>
                  {this.handleDragBlock(item.name)}
                  {provided.placeholder}
                </div>
                <FindLocation />
              </div>
            )}
          </Droppable>
        ))}
      </div>
    );
  }
}

export default DropSchedule;
