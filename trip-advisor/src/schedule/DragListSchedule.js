import React from "react";
import styles from "../scss/schedule.module.scss";
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
      console.log(item);
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
      .doc("userId")
      .collection("data")
      .doc(`travel${window.location.pathname.substring(23)}`)
      .collection("dateBlockDetail")
      .doc(this.props.date)
      .set({
        morning: travelAll,
        name: this.props.date,
      });
  };
  render() {
    // console.log(this.props.travelDetailCountry);
    return (
      <div>
        {this.props.travelDetailCountry[this.props.item] === undefined && (
          <div className={styles.emptyList}>Drop Here!</div>
        )}
        {this.props.travelDetailCountry[this.props.item] &&
          this.props.travelDetailCountry[this.props.item].map((item, i) => {
            return (
              <Draggable draggableId={`Id-${item.id}`} index={i} key={item.id}>
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
                    <div>{item.star_level}</div>
                  </div>
                )}
              </Draggable>
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
};

export default DragListSchedule;
