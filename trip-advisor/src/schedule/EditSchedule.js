import React from "react";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import DropSchedule from "./DropSchedule";
import ScheduleMap from "./ScheduleMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext } from "react-beautiful-dnd";

const db = firebase.firestore();

class EditSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      travelData: [],
      travelShowId: null,
      travelMorning: [],
      travelMorningAll: {},
      searchCountry: "",
      searchCountryDetail: {},
      travelDataArr: [],
      locationLikeDetail: {},
      infoOpen: false,
      selectedPlace: {},
      traffic: {},
      trafficDetail: {},
      userUid: "",
      showLocationSearch: false,
    };
  }

  componentDidMount() {
    let travelShowId = window.location.pathname.substring(23);
    this.setState({ travelShowId: travelShowId });
    let travelDataTemp = [];

    document.getElementById("scheduleListRange").style.display = "none";

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          userUid: user.uid,
        });
      } else {
        alert("請先登入");
        this.props.history.push("/member");
      }

      db.collection("schedule")
        .doc(user.uid)
        .collection("data")
        .doc(`travel${travelShowId}`)
        .onSnapshot((doc) => {
          travelDataTemp.push(doc.data());
          this.setState({ travelData: travelDataTemp });
        });

      db.collection("schedule")
        .doc(user.uid)
        .collection("data")
        .doc(`travel${travelShowId}`)
        .collection("dateBlockDetail")
        .onSnapshot((docs) => {
          let travelDataArrTemp = [];
          docs.forEach((doc) => {
            travelDataArrTemp.push(doc.data());
          });

          this.setState({
            travelDataArr: travelDataArrTemp,
          });
        });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.travelDataArr !== this.state.travelDataArr) {
      let locationSpot = {};

      this.state.travelDataArr.forEach((item) => {
        let arr = [];
        if (item.morning.length > 1) {
          for (let i = 0; i < item.morning.length - 1; i++) {
            let obj = {};

            obj["origin"] = new window.google.maps.LatLng(
              item.morning[i].pos.lat,
              item.morning[i].pos.lng
            );
            obj["destination"] = new window.google.maps.LatLng(
              item.morning[i + 1].pos.lat,
              item.morning[i + 1].pos.lng
            );
            obj["travelMode"] = "DRIVING";
            obj["id"] = i;
            arr.push(obj);
          }
        }
        locationSpot[item.name] = arr;
      });

      this.setState({
        trafficDetail: locationSpot,
      });
    }
  }

  getCountry = (country) => {
    this.setState({ searchCountry: country });
  };

  onDragStart = (result) => {
    const { draggableId } = result;

    let travelMorningAllTemp = {};

    db.collection("schedule")
      .doc(this.state.userUid)
      .collection("data")
      .doc(`travel${this.state.travelShowId}`)
      .collection("dateBlockDetail")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          travelMorningAllTemp[doc.data().name] = doc.data().morning;
        });
        this.setState({ travelMorningAll: travelMorningAllTemp });
        // console.log(travelMorningAllTemp);
      });

    if (draggableId.substr(0, 1) === "i") {
      // console.log(result);
      db.collection("country")
        .doc(this.state.searchCountry)
        .collection("location")
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            if (doc.data().id === draggableId.substring(3)) {
              let obj = {
                country: this.state.searchCountry,
                name: doc.data().name,
                id: doc.data().id,
                pos: {
                  lat: parseFloat(doc.data().latitude),
                  lng: parseFloat(doc.data().longitude),
                },
              };

              this.setState({
                searchCountryDetail: obj,
              });
            }
          });
        });
    }

    if (draggableId.substr(0, 1) === "L") {
      // console.log(result);
      db.collection("schedule")
        .doc(this.state.userUid)
        .get()
        .then((docAll) => {
          let locationLikeDetailTemp = {};
          docAll.data().like.forEach((location) => {
            if (location.id.toString() === draggableId.substring(3)) {
              locationLikeDetailTemp = location;
              locationLikeDetailTemp.id = location.id.toString();
              this.setState({
                locationLikeDetail: locationLikeDetailTemp,
              });
              // console.log(locationLikeDetailTemp);
            }
          });
        });
    }
  };

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      console.log("no destination");
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

        travelMorningTemp = Array.from(
          this.state.travelMorningAll[source.droppableId.substring(5)]
        );
        const [remove] = travelMorningTemp.splice(source.index, 1);

        travelMorningTemp.splice(destination.index, 0, remove);
        this.setState({ travelMorning: travelMorningTemp });

        db.collection("schedule")
          .doc(this.state.userUid)
          .collection("data")
          .doc(`travel${this.state.travelShowId}`)
          .collection("dateBlockDetail")
          .doc(destination.droppableId.substring(5))
          .set({
            morning: travelMorningTemp,
            name: destination.droppableId.substring(5),
          });
      } else {
        let travelMorningDragTemp = [];
        let travelMorningDropTemp = [];
        travelMorningDragTemp = Array.from(
          this.state.travelMorningAll[source.droppableId.substring(5)]
        );
        travelMorningDropTemp = Array.from(
          this.state.travelMorningAll[destination.droppableId.substring(5)]
        );
        const [remove] = travelMorningDragTemp.splice(source.index, 1);
        travelMorningDropTemp.splice(destination.index, 0, remove);

        db.collection("schedule")
          .doc(this.state.userUid)
          .collection("data")
          .doc(`travel${this.state.travelShowId}`)
          .collection("dateBlockDetail")
          .doc(source.droppableId.substring(5))
          .set({
            morning: travelMorningDragTemp,
            name: source.droppableId.substring(5),
          });

        db.collection("schedule")
          .doc(this.state.userUid)
          .collection("data")
          .doc(`travel${this.state.travelShowId}`)
          .collection("dateBlockDetail")
          .doc(destination.droppableId.substring(5))
          .set({
            morning: travelMorningDropTemp,
            name: destination.droppableId.substring(5),
          });
      }
    }

    if (draggableId.substr(0, 1) === "i" || draggableId.substr(0, 1) === "L") {
      let travelMorningTemp = [];

      travelMorningTemp = Array.from(
        this.state.travelMorningAll[destination.droppableId.substring(5)]
      );

      if (draggableId.substr(0, 1) === "i") {
        travelMorningTemp.splice(
          destination.index,
          0,
          this.state.searchCountryDetail
        );
      } else {
        travelMorningTemp.splice(
          destination.index,
          0,
          this.state.locationLikeDetail
        );
      }

      this.setState({ travelMorning: travelMorningTemp });

      db.collection("schedule")
        .doc(this.state.userUid)
        .collection("data")
        .doc(`travel${this.state.travelShowId}`)
        .collection("dateBlockDetail")
        .doc(destination.droppableId.substring(5))
        .set({
          morning: travelMorningTemp,
          name: destination.droppableId.substring(5),
        });
    }
  };

  handleLocationShow = () => {
    document.getElementById("findLocationShow").style.display = "block";
    document.getElementById("searchAll").style.animation = "none";
    document.getElementById("locationList").style.animation = "none";
    document.getElementById("likeLocationShow").style.display = "none";
  };
  handleCollectionShow = () => {
    document.getElementById("findLocationShow").style.display = "none";
    document.getElementById("likeLocationShow").style.display = "block";
    document.getElementById("likeList").style.display = "block";
  };

  setInfoOpen = (state) => {
    this.setState({
      infoOpen: state,
    });
  };
  setSelectedPlace = (item) => {
    // console.log(item);
    let obj = {
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
    };
    this.setState({
      selectedPlace: {
        pos: obj,
        name: item.name,
      },
    });
  };
  setSelectedPlaceMarker = (item) => {
    // console.log(item);
    let obj = {};
    obj["pos"] = {
      lat: item.pos.lat,
      lng: item.pos.lng,
    };
    obj["name"] = item.name;

    this.setState({
      selectedPlace: obj,
    });
  };

  showTraffic = (data) => {
    // console.log(data);
    this.setState({
      traffic: data,
    });
  };
  handleTraffic = (traffic) => {
    // console.log(traffic);
    this.setState({
      trafficDetail: traffic,
    });
  };

  handleShowLocationDrag = () => {
    if (this.state.showLocationSearch === false) {
      document.getElementById("locationDetail").style.display = "flex";
      document.getElementById("locationSection0").style.opacity = 1;
      document.getElementById("locationSection0").style.width = "300px";
      document.getElementById("locationList").style.width = "200px";
      document.getElementById("likeList").style.width = "200px";
      document.getElementById("switchBtn").style.opacity = 1;
      document.getElementById("arrow").style.transform = "rotate(-180deg)";
      document.getElementById("arrow").style.transition = "0.3s";
      this.setState({ showLocationSearch: true });
    } else {
      document.getElementById("locationSection0").style.opacity = 0;
      document.getElementById("locationSection0").style.width = "0px";
      document.getElementById("locationList").style.width = "0px";
      document.getElementById("likeList").style.width = "0px";
      document.getElementById("switchBtn").style.opacity = 0;
      document.getElementById("arrow").style.transition = "0.3s";
      document.getElementById("arrow").style.transform = "rotate(0deg)";
      this.setState({ showLocationSearch: false });
    }
  };

  render() {
    return (
      <div className={styles.scheduleWithMap}>
        <div className={styles.schedule}>
          <div className={styles.switchBtn} id="switchBtn">
            <button onClick={this.handleLocationShow} className={styles.btn}>
              <span>景點搜尋</span>
              <div className={`${styles.triangle} ${styles.t1}`}></div>
              <div className={`${styles.triangle} ${styles.t2}`}></div>
            </button>

            <button onClick={this.handleCollectionShow} className={styles.btn}>
              <span>我的收藏</span>
              <div className={`${styles.triangle} ${styles.t1}`}></div>
              <div className={`${styles.triangle} ${styles.t2}`}></div>
            </button>
          </div>
          {this.state.travelData.map((item) => {
            return (
              <div key={item.id} className={styles.scheduleListTopLeft}>
                <div className={styles.scheduleListDetailTopLeft}>
                  <div
                    className={styles.arrowBounce}
                    id="arrow"
                    onClick={this.handleShowLocationDrag}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                  <img
                    className={styles.schedulePhoto}
                    src={item.CoverImgUrl}
                  />

                  <div className={styles.scheduleTitle}>
                    {item.TravelScheduleName}
                  </div>
                  <div className={styles.date}>
                    {item.StartDate} ～{" "}
                    <span className={styles.date2}>{item.EndDate}</span>
                  </div>
                  <div className={styles.scheduleLayer}></div>
                </div>
              </div>
            );
          })}
          <DragDropContext
            onDragEnd={this.onDragEnd}
            onDragStart={this.onDragStart}
          >
            {this.state.travelData.map((i) => {
              return (
                <DropSchedule
                  key={i}
                  getCountry={this.getCountry}
                  setInfoOpen={this.setInfoOpen}
                  selectedPlace={this.state.selectedPlace}
                  setSelectedPlace={this.setSelectedPlace}
                  traffic={this.state.traffic}
                  handleTraffic={this.handleTraffic}
                  trafficDetail={this.state.trafficDetail}
                  userUid={this.state.userUid}
                />
              );
            })}
          </DragDropContext>
        </div>

        <div className={styles.scheduleMap}>
          <ScheduleMap
            travelDataArr={this.state.travelDataArr}
            infoOpen={this.state.infoOpen}
            setInfoOpen={this.setInfoOpen}
            selectedPlace={this.state.selectedPlace}
            setSelectedPlaceMarker={this.setSelectedPlaceMarker}
            travelShowId={this.state.travelShowId}
            showTraffic={this.showTraffic}
            // handleTraffic={this.handleTraffic}
            trafficDetail={this.state.trafficDetail}
            userUid={this.state.userUid}
          />
        </div>
      </div>
    );
  }
}

EditSchedule.propTypes = {
  travelShow: PropTypes.number,
  history: PropTypes.object,
};

export default EditSchedule;
