import React from "react";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import FindLocation from "./FindLocation";
import DragListSchedule from "./DragListSchedule";
import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";

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
        travelDateDetailTemp = [];
        querySnapshot.forEach((doc) => {
          travelDateDetailTemp.push(doc.data());
        });
        this.setState({ travelDateDetail: travelDateDetailTemp });
        let travelDetailCountryTemp = {};

        travelDateDetailTemp.forEach((dates) => {
          let arr = [];

          dates.morning.forEach((date) => {
            if (dates.morning.length !== 0) {
              db.collection("country")
                .doc(date.country)
                .collection("location")
                .where("id", "==", date.id)

                .get()
                .then((docs) => {
                  docs.forEach((doc) => {
                    arr.push(doc.data());
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

  render() {
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
                  <DragListSchedule
                    item={item.name}
                    date={item.name}
                    travelDetailCountry={this.state.travelDetailCountry}
                  />
                  {provided.placeholder}
                </div>
                <FindLocation getCountry={this.props.getCountry} />
              </div>
            )}
          </Droppable>
        ))}
      </div>
    );
  }
}

DropSchedule.propTypes = {
  getCountry: PropTypes.func,
};

export default DropSchedule;
