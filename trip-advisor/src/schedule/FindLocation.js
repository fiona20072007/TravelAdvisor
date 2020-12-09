import React from "react";
import PropTypes from "prop-types";
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
      countryId: "",
      locationDetail: [],
      infoOpen: false,
      locationArray: [],
      locationArrayT: [],
      likeList: [],
    };
  }

  componentDidMount() {
    db.collection("schedule")
      .doc("userId")
      .onSnapshot((doc) => {
        if (doc.data()["like"] === undefined) {
          db.collection("schedule").doc("userId").set(
            {
              like: [],
            },
            { merge: true }
          );
        } else {
          this.setState({ likeList: doc.data()["like"] });
          if (this.state.value !== "") {
            doc.data()["like"].forEach((likeItem) => {
              document.getElementById(
                `likeSearch-${likeItem.id}`
              ).style.display = "block";
            });
          }
        }
      });
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
            docs.forEach((doc) => {
              const tag = {
                value: doc.id,
                label: doc.data().name,
              };
              recommendedTags.push(tag);
              this.setState({
                countryId: doc.data().id,
              });
            });
            return resolve(recommendedTags);
          } else {
            return resolve([]);
          }
        });
    });
  };

  handleOnChangeCountry = () => {
    this.props.getCountry(this.state.value);
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
                  className={styles.item}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  onMouseOver={() => {
                    document.getElementById(
                      `likeSearch-${item.id}`
                    ).style.display = "block";
                    if (this.state.likeList.find((i) => i.id === item.id)) {
                      document.getElementById(
                        `likeSearch-${item.id}`
                      ).style.fill = "rgb(255, 128, 191)";
                      document.getElementById(`likeSearch-${item.id}`).style[
                        "fill-opacity"
                      ] = 1;
                    } else {
                      document.getElementById(
                        `likeSearch-${item.id}`
                      ).style.fill = "rgb(255, 255, 255)";
                      document.getElementById(`likeSearch-${item.id}`).style[
                        "fill-opacity"
                      ] = 0.3;
                    }
                  }}
                  onMouseLeave={() => {
                    if (this.state.likeList.find((i) => i.id === item.id)) {
                      return;
                    } else {
                      document.getElementById(
                        `likeSearch-${item.id}`
                      ).style.display = "none";
                    }
                  }}
                >
                  <div
                    id={`likeSearch-${item.id}`}
                    className={styles.searchLike}
                    onClick={() => this.handleLike(item)}
                  >
                    <svg
                      id="icon-heart"
                      viewBox="0 0 32 32"
                      width="30"
                      height="20"
                    >
                      <title>heart</title>
                      <path d="M29.306 4.768c-1.662-1.66-3.958-2.687-6.493-2.687s-4.831 1.027-6.493 2.687l-0.32 0.32-0.32-0.32c-1.662-1.664-3.96-2.694-6.498-2.694-5.072 0-9.183 4.112-9.183 9.183 0 2.534 1.026 4.828 2.686 6.49l11.363 11.373c0.499 0.496 1.187 0.803 1.947 0.803s1.448-0.307 1.947-0.803l11.353-11.36c1.671-1.66 2.705-3.96 2.705-6.501 0-2.536-1.030-4.832-2.695-6.491l-0-0z"></path>
                    </svg>
                  </div>
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

    if (this.state.value !== "") {
      window.setTimeout(
        () =>
          this.state.likeList.forEach((likeItem) => {
            document.getElementById(`likeSearch-${likeItem.id}`).style.display =
              "block";
          }),
        300
      );
    }
  };

  handleOnChange(id) {
    document.getElementById(id).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  setInfoOpen = (state) => {
    this.setState({
      infoOpen: state,
    });
  };

  handleLike = (item) => {
    let obj = {
      country: item.country,
      id: item.id,
      pos: {
        lat: item.latitude,
        lng: item.longitude,
      },
    };
    let likeArr = [...this.state.likeList];

    if (this.state.likeList.find((i) => i.id === item.id)) {
      document.getElementById(`likeSearch-${item.id}`).style.fill =
        "rgb(255, 255, 255)";
      document.getElementById(`likeSearch-${item.id}`).style[
        "fill-opacity"
      ] = 0.3;
      let likeArrFilter = [...this.state.likeList];
      likeArr = likeArrFilter.filter((i) => i.id !== item.id);
    } else {
      document.getElementById(`likeSearch-${item.id}`).style.fill =
        "rgb(255, 128, 191)";
      document.getElementById(`likeSearch-${item.id}`).style[
        "fill-opacity"
      ] = 1;
      likeArr.push(obj);
    }

    this.setState({
      likeList: likeArr,
    });
    db.collection("schedule").doc("userId").set(
      {
        like: likeArr,
      },
      { merge: true }
    );
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
              onChange={() => this.handleOnChange(this.state.countryId)}
            />
          </div>
        </div>

        <div className={styles.locationList}>{this.state.locationArray}</div>
      </div>
    );
  }
}

FindLocation.propTypes = {
  getCountry: PropTypes.func,
};

export default FindLocation;
