import React from "react";
// import PropTypes from "prop-types";
import firebase from "../firebase";
import AsyncSelect from "react-select/async";
import styles from "../scss/schedule.module.scss";
import { Draggable } from "react-beautiful-dnd";

// import { nanoid } from "nanoid";

const db = firebase.firestore();

class FindLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      locationBanner: [],
      locationDetail: [],
      center: {},
      zoom: 15,
      selectedPlace: {},
      infoOpen: false,
      locationArray: [],
      locationArrayT: [],
    };
  }

  loadOptionsCountry = async (inputValue) => {
    return new Promise((resolve) => {
      db.collection("indexCountry")
        .orderBy("name")
        .startAt(inputValue)
        .endAt(inputValue + "\uf8ff")
        .get()
        .then((docs) => {
          if (!docs.empty) {
            let recommendedTags = [];
            docs.forEach((doc) => {
              const tag = {
                value: { lat: doc.data().latitude, lng: doc.data().longitude },
                label: doc.data().name,
              };
              recommendedTags.push(tag);
              this.setState({
                value: doc.data().name,
              });
            });

            return resolve(recommendedTags);
          } else {
            return resolve([]);
          }
        });
    });
  };

  loadOptions = async (inputValue) => {
    return new Promise((resolve) => {
      db.collection("country")
        .doc(this.state.value)
        .collection("location")
        .orderBy("name")
        .startAt(inputValue)
        .endAt(inputValue + "\uf8ff")
        .get()
        .then((docs) => {
          if (!docs.empty) {
            let recommendedTags = [];
            docs.forEach(function (doc) {
              const tag = {
                value: doc.id,
                label: doc.data().name,
              };
              recommendedTags.push(tag);
            });
            return resolve(recommendedTags);
          } else {
            return resolve([]);
          }
        });
    });
  };

  handleOnChangeCountry = () => {
    db.collection("country")
      .doc(this.state.value)
      .collection("location")
      .get()
      .then((doc) => {
        let locationDetailTemp = [];
        doc.forEach(function (doc) {
          locationDetailTemp.push({
            name: doc.data().name,
            country: doc.data().Country,
            city: doc.data().City,
            area: doc.data().Area,
            photo: doc.data().PointImgUrl,
            pos: {
              lat: parseFloat(doc.data().latitude, 10),
              lng: parseFloat(doc.data().longitude, 10),
            },
            latitude: parseFloat(doc.data().latitude, 10),
            longitude: parseFloat(doc.data().longitude, 10),
            address: doc.data().address,
            open_time: doc.data().open_time,
            telephone: doc.data().telephone,
            star_level: doc.data().star_level,
            travelPoint: doc.data().TravelPoint_Be_Added_Count,
            url: doc.data().url,
            id: parseInt(doc.data().id),
          });
        });
        let locationArrayTemp = locationDetailTemp.map((item) => {
          return (
            <Draggable
              draggableId={`id-${item.id}`}
              index={item.id}
              key={item.id}
            >
              {(provided) => (
                <div
                  id={item.id}
                  onClick={() => {
                    console.log(123);
                  }}
                  className={styles.item}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  <img src={item.photo} className={styles.itemPhoto}></img>
                  <div className={styles.itemName}>{item.name}</div>
                  <div>{item.star_level}</div>
                </div>
              )}
            </Draggable>
          );
        });

        this.setState({
          locationDetail: locationDetailTemp,
          locationArray: locationArrayTemp,
        });
        console.log(locationDetailTemp);
      });
  };

  setInfoOpen = (state) => {
    this.setState({
      infoOpen: state,
    });
  };

  render() {
    return (
      <div className={styles.locationAll}>
        <div className={styles.searchAll}>
          <div>
            <div className={styles.title}>挑選國家</div>
            <AsyncSelect
              className={styles.locationInput}
              loadOptions={this.loadOptionsCountry}
              onChange={this.handleOnChangeCountry}
            />
          </div>
          <div>
            <div className={styles.title}>挑選景點</div>
            <AsyncSelect
              className={styles.locationInput}
              loadOptions={this.loadOptions}
              onChange={this.handleOnChange}
            />
          </div>
        </div>

        <div className={styles.locationList}>{this.state.locationArray}</div>
      </div>
    );
  }
}

// FindLocation.propTypes = {
//   match: PropTypes.object
// };

export default FindLocation;
