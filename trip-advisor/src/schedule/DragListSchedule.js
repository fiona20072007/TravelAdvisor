import React from "react";
import styles from "../scss/schedule.module.scss";
import TrafficSchedule from "./TrafficSchedule";
import firebase from "../firebase";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";

const db = firebase.firestore();

class DragListSchedule extends React.Component {
  deleteLocation = (i) => {
    let travelMorningTemp = [];
    let travelAll = [];

    travelMorningTemp = Array.from(
      this.props.travelDetailCountry[this.props.date]
    );
    travelMorningTemp.splice(i, 1);
    travelMorningTemp.forEach((item) => {
      let travelSet = {};
      // console.log(item);
      travelSet["country"] = item.Country;
      travelSet["name"] = item.name;
      travelSet["id"] = item.id;
      travelSet["pos"] = {
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
      };
      travelAll.push(travelSet);
    });

    db.collection("schedule")
      .doc(this.props.userUid)
      .collection("data")
      .doc(`travel${window.location.pathname.substring(23)}`)
      .collection("dateBlockDetail")
      .doc(this.props.date)
      .set({
        morning: travelAll,
        name: this.props.date,
      });

    if (i === this.props.travelDetailCountry[this.props.date].length - 1) {
      let obj = Object.assign({}, this.props.trafficDetail);
      obj[this.props.date].splice(i - 1, 1);
      this.props.handleTraffic(obj);
      // console.log(obj);
    }
  };

  render() {
    // console.log(
    //   "this.props.traffic[this.props.item]",
    //   this.props.traffic[this.props.item]
    // );
    // console.log(this.props.travelDetailCountry);
    return (
      <div>
        {this.props.travelDetailCountry[this.props.item] === undefined && (
          <div className={styles.emptyList}>Drop Here!</div>
        )}
        {this.props.travelDetailCountry[this.props.item] &&
          // this.props.traffic[this.props.item] !== undefined &&
          this.props.travelDetailCountry[this.props.item].map((item, i) => {
            return (
              <div key={item.id}>
                <Draggable draggableId={`Id-${item.id}`} index={i}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className={styles.itemList}
                      onMouseOver={() =>
                        (document.getElementById(
                          `delete-${item.id}`
                        ).style.display = "block")
                      }
                      onMouseLeave={() =>
                        (document.getElementById(
                          `delete-${item.id}`
                        ).style.display = "none")
                      }
                      onClick={() => {
                        this.props.setInfoOpen(true);
                        this.props.setSelectedPlace(item);
                      }}
                    >
                      <div
                        className={styles.itemListDelete}
                        id={`delete-${item.id}`}
                        onClick={() => {
                          this.deleteLocation(i);
                        }}
                      >
                        x
                      </div>
                      <img
                        src={item.PointImgUrl}
                        className={styles.itemPhoto}
                      ></img>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.ratings}>
                        <div className={styles["empty-stars"]}></div>
                        <div
                          className={styles["full-stars"]}
                          style={{
                            width: this.props.handleStar(item.star_level),
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Draggable>

                {this.props.traffic[this.props.item] !== undefined &&
                  i < this.props.traffic[this.props.item].length && (
                    <TrafficSchedule
                      traffic={this.props.traffic}
                      date={this.props.item}
                      num={i}
                      handleTraffic={this.props.handleTraffic}
                      trafficDetail={this.props.trafficDetail}
                    />
                  )}
              </div>
            );
          })}
      </div>
    );
  }
}

DragListSchedule.propTypes = {
  item: PropTypes.string,
  travelDetailCountry: PropTypes.object,
  date: PropTypes.string,
  setInfoOpen: PropTypes.func,
  setSelectedPlace: PropTypes.func,
  traffic: PropTypes.object,
  handleTraffic: PropTypes.func,
  trafficDetail: PropTypes.object,
  userUid: PropTypes.string,
  handleStar: PropTypes.func,
};

export default DragListSchedule;
