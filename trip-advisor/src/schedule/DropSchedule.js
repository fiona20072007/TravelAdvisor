import React from "react";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import FindLocation from "./FindLocation";
import { Droppable, Draggable } from "react-beautiful-dnd";

const db = firebase.firestore();

class DropSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      travelData: [],
      isLoading: true,
      dateBlock: "",
      travelDateDetail: [],
      travelDetailCountry: {},
    };
  }

  componentDidMount() {
    let travelShowId = window.location.pathname.substring(23);
    let travelDataTemp = [];
    let travelDateDetailTemp = [];

    db.collection("schedule")
      .doc("userId")
      .collection("data")
      .doc(`travel${travelShowId}`)
      .get()
      .then((doc) => {
        travelDataTemp.push(doc.data());
        this.setState({ travelData: travelDataTemp });
      });

    db.collection("schedule")
      .doc("userId")
      .collection("data")
      .doc(`travel${travelShowId}`)
      .collection("dateBlockDetail")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          travelDateDetailTemp.push(doc.data());
        });
        this.setState({ travelDateDetail: travelDateDetailTemp });
        let travelDetailCountryTemp = {};

        travelDateDetailTemp.forEach((countries) => {
          let arr = [];
          return countries.morning.forEach((country) => {
            if (countries.morning.length !== 0) {
              db.collection("country")
                .doc(country.country)
                .collection("location")
                .get()
                .then((docs1) => {
                  docs1.forEach((doc) => {
                    if (doc.data().id == country.id) {
                      arr.push(doc.data());
                    }
                  });
                  travelDetailCountryTemp[countries.name] = arr;
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
    console.log(
      "this.state.travelDetailCountry",
      this.state.travelDetailCountry
    );
    if (this.state.travelDetailCountry[name] === undefined) {
      return <div>321</div>;
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
                <div>{provided.placeholder}</div>
              </div>
            )}
          </Draggable>
        );
      });
    }

    // return this.state.travelDateDetail
    //   .filter(detail => {
    //     return detail.name === name;
    //   })
    //   .map(date => {
    //     if (date.morning.length !== 0) {
    //       if (this.state.travelDetailCountry !== 0) {
    //         return this.state.travelDetailCountry.map((location, i) => {
    //           return (
    //             <Draggable draggableId={`Id-${i}`} index={i} key={i}>
    //               {provided => (
    //                 <div
    //                   {...provided.draggableProps}
    //                   {...provided.dragHandleProps}
    //                   ref={provided.innerRef}
    //                   className={styles.itemList}
    //                 >
    //                   <img
    //                     src={location.PointImgUrl}
    //                     className={styles.itemPhoto}
    //                   ></img>
    //                   <div className={styles.itemName}>{location.name}</div>
    //                   <div>{location.star_level}</div>
    //                   <div>{provided.placeholder}</div>
    //                 </div>
    //               )}
    //             </Draggable>
    //           );
    //         });
    //       }
    //     }
    //   });
  };

  render() {
    console.log(this.state.travelDateDetail);
    return (
      <Droppable droppableId={"drop"}>
        {(provided) => (
          <div className={styles.scheduleDateAll}>
            {this.state.travelDateDetail.map((item) => (
              <div
                className={styles.scheduleDetail}
                key={item.id}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className={styles.scheduleDateOnly}>{item.name}</div>
                {this.handleDragBlock(item.name)}

                {/* <Draggable draggableId={`Id-${item.id}`} index={item.id}>
                  {provided => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <div>123</div>
                      <div>{provided.placeholder}</div>
                    </div>
                  )}
                </Draggable> */}
              </div>
            ))}

            <FindLocation />
          </div>
        )}
      </Droppable>
    );
  }
}

DropSchedule.propTypes = {
  items: PropTypes.array,
};

export default DropSchedule;
