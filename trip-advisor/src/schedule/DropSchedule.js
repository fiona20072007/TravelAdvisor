import React from "react";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import FindLocation from "./FindLocation";
import LikeLocation from "./LikeLocation";
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

          if (dates.morning.length !== 0) {
            dates.morning.forEach((date, index) => {
              if (dates.morning.length !== 0) {
                db.collection("country")
                  .doc(date.country)
                  .collection("location")
                  .where("id", "==", date.id)
                  .get()
                  .then((docs) => {
                    docs.forEach((doc) => {
                      arr[index] = doc.data();
                    });
                    travelDetailCountryTemp[dates.name] = arr;

                    this.setState({
                      travelDetailCountry: travelDetailCountryTemp,
                    });
                  });
              }
            });
          } else {
            this.setState({
              travelDetailCountry: {},
            });
          }
        });
      });
  }

  render() {
    // console.log(this.state.travelDetailCountry);
    //把這個state往上拉到editSchedule.js再set
    return (
      <div className={styles.scheduleDateAll}>
        {this.state.travelDateDetail.map((item, i) => (
          <Droppable droppableId={`drop-${item.name}`} key={i}>
            {(provided) => (
              <div>
                <div className={styles.scheduleDateOnly}>{item.name}</div>
                <div
                  className={styles.scheduleDetail}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <DragListSchedule
                    item={item.name}
                    date={item.name}
                    travelDetailCountry={this.state.travelDetailCountry}
                    setInfoOpen={this.props.setInfoOpen}
                    selectedPlace={this.props.selectedPlace}
                    setSelectedPlace={this.props.setSelectedPlace}
                  />
                  {provided.placeholder}
                </div>

                {i == this.state.travelDateDetail.length - 1 && (
                  <div className="findLocationShow">
                    <FindLocation getCountry={this.props.getCountry} />
                  </div>
                )}

                {i == this.state.travelDateDetail.length - 1 && (
                  <div className="likeLocationShow">
                    <LikeLocation />
                  </div>
                )}
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
  setInfoOpen: PropTypes.func,
  selectedPlace: PropTypes.object,
  setSelectedPlace: PropTypes.func,
};

export default DropSchedule;
