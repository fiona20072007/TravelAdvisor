import React from "react";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import DropSchedule from "./DropSchedule";
import ScheduleMap from "./ScheduleMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext } from "react-beautiful-dnd";
import {
  getTravelTitleData,
  getTravelScheduleData,
  getLocationDetail,
} from "../Utils";

const db = firebase.firestore();

class EditSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleData: {},
      travelShowId: null,
      searchCountry: "",
      searchCountryDetail: {},
      locationLikeDetail: {},
      infoOpen: false,
      selectedPlace: {},
      traffic: {},
      trafficDetail: {},
      userUid: "",
      showLocationSearch: false,
      btnClick: true,
      travelDateDetail: [],
      travelDetailCountry: {},
      dragging: false,
    };
  }

  componentDidMount() {
    const travelShowId = window.location.pathname.substring(23);
    this.setState({ travelShowId: travelShowId });

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

      let titleDataTemp = {};
      getTravelTitleData(user.uid, travelShowId).then((doc) => {
        titleDataTemp = { ...doc.data() };
        this.setState({ titleData: titleDataTemp });
      });

      let travelDateDetailTemp = [];
      let travelDetailCountryTemp = {};
      getTravelScheduleData(user.uid, travelShowId).then((docs) => {
        travelDateDetailTemp = [];
        docs.forEach((doc) => {
          travelDateDetailTemp.push(doc.data());
          travelDetailCountryTemp[doc.data().name] = doc.data().morning;
        });
        this.setState({
          travelDateDetail: travelDateDetailTemp,
          travelDetailCountry: travelDetailCountryTemp,
        });
        document.getElementById("loading").style.display = "none";
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.travelDateDetail !== this.state.travelDateDetail) {
      let locationSpot = {};

      this.state.travelDateDetail.forEach((item) => {
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
    this.setState({
      dragging: true,
    });

    const { draggableId } = result;
    const dragCardCategory = draggableId.substr(0, 1);
    const dragCardId = draggableId.substring(3);

    if (dragCardCategory === "i") {
      getLocationDetail(this.state.searchCountry).then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().id === dragCardId) {
            let obj = {
              country: this.state.searchCountry,
              name: doc.data().name,
              id: doc.data().id,
              PointImgUrl: doc.data().PointImgUrl,
              star_level: doc.data().star_level,
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

    if (dragCardCategory === "L") {
      db.collection("schedule")
        .doc(this.state.userUid)
        .get()
        .then((docAll) => {
          let locationLikeDetailTemp = {};
          docAll.data().like.forEach((location) => {
            if (location.id.toString() === dragCardId) {
              locationLikeDetailTemp = location;
              locationLikeDetailTemp.id = location.id.toString();
              this.setState({
                locationLikeDetail: locationLikeDetailTemp,
              });
            }
          });
        });
    }
  };

  onDragEnd = (result) => {
    this.setState({
      dragging: false,
    });

    const { destination, source, draggableId } = result;
    const dragCardCategory = draggableId.substr(0, 1);
    const sourceDroppableId = source.droppableId.substring(5);
    let destinationDroppableId = null;

    if (!destination) {
      return;
    } else {
      destinationDroppableId = destination.droppableId.substring(5);
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (dragCardCategory === "I") {
      if (
        destination.droppableId === source.droppableId &&
        destination.index !== source.index
      ) {
        let travelMorningTemp = [];

        travelMorningTemp = Array.from(
          this.state.travelDetailCountry[sourceDroppableId]
        );
        const [remove] = travelMorningTemp.splice(source.index, 1);

        travelMorningTemp.splice(destination.index, 0, remove);

        let travelDetailCountryTemp = { ...this.state.travelDetailCountry };
        let travelDateDetailTemp = [...this.state.travelDateDetail];

        const travelDateDetailTemp2 = travelDateDetailTemp.map((item) => {
          if (item.name === destinationDroppableId) {
            return {
              ...item,
              morning: travelMorningTemp,
            };
          }
          return item;
        });
        travelDetailCountryTemp[destinationDroppableId] = travelMorningTemp;
        this.setState({
          travelDetailCountry: travelDetailCountryTemp,
          travelDateDetail: travelDateDetailTemp2,
        });

        db.collection("schedule")
          .doc(this.state.userUid)
          .collection("data")
          .doc(`travel${this.state.travelShowId}`)
          .collection("dateBlockDetail")
          .doc(destinationDroppableId)
          .set({
            morning: travelMorningTemp,
            name: destinationDroppableId,
          });
      } else {
        let travelMorningDragTemp = [];
        let travelMorningDropTemp = [];
        travelMorningDragTemp = Array.from(
          this.state.travelDetailCountry[sourceDroppableId]
        );
        travelMorningDropTemp = Array.from(
          this.state.travelDetailCountry[destinationDroppableId]
        );
        const [remove] = travelMorningDragTemp.splice(source.index, 1);
        travelMorningDropTemp.splice(destination.index, 0, remove);

        let travelDetailCountryTemp = { ...this.state.travelDetailCountry };
        let travelDateDetailTemp = [...this.state.travelDateDetail];

        travelDateDetailTemp.forEach((item) => {
          if (item.name === destinationDroppableId) {
            item.morning = travelMorningDropTemp;
          } else if (item.name === sourceDroppableId) {
            item.morning = travelMorningDragTemp;
          }
        });
        travelDetailCountryTemp[sourceDroppableId] = travelMorningDragTemp;
        travelDetailCountryTemp[destinationDroppableId] = travelMorningDropTemp;
        this.setState({
          travelDetailCountry: travelDetailCountryTemp,
          travelDateDetail: travelDateDetailTemp,
        });

        db.collection("schedule")
          .doc(this.state.userUid)
          .collection("data")
          .doc(`travel${this.state.travelShowId}`)
          .collection("dateBlockDetail")
          .doc(sourceDroppableId)
          .set({
            morning: travelMorningDragTemp,
            name: sourceDroppableId,
          });

        db.collection("schedule")
          .doc(this.state.userUid)
          .collection("data")
          .doc(`travel${this.state.travelShowId}`)
          .collection("dateBlockDetail")
          .doc(destinationDroppableId)
          .set({
            morning: travelMorningDropTemp,
            name: destinationDroppableId,
          });
      }
    }

    if (dragCardCategory === "i" || dragCardCategory === "L") {
      let travelMorningTemp = [];

      travelMorningTemp = Array.from(
        this.state.travelDetailCountry[destinationDroppableId]
      );

      if (dragCardCategory === "i") {
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

      let travelDetailCountryTemp = { ...this.state.travelDetailCountry };
      let travelDateDetailTemp = [...this.state.travelDateDetail];

      travelDateDetailTemp.forEach((item) => {
        if (item.name === destinationDroppableId) {
          item.morning = travelMorningTemp;
        }
      });

      travelDetailCountryTemp[destinationDroppableId] = travelMorningTemp;
      this.setState({
        travelDetailCountry: travelDetailCountryTemp,
        travelDateDetail: travelDateDetailTemp,
      });

      db.collection("schedule")
        .doc(this.state.userUid)
        .collection("data")
        .doc(`travel${this.state.travelShowId}`)
        .collection("dateBlockDetail")
        .doc(destinationDroppableId)
        .set({
          morning: travelMorningTemp,
          name: destinationDroppableId,
        });
    }
  };

  handleLocationShow = () => {
    document.getElementById("findLocationShow").style.display = "block";
    document.getElementById("searchAll").style.animation = "none";
    document.getElementById("locationList").style.animation = "none";
    document.getElementById("likeLocationShow").style.display = "none";
    this.setState({
      btnClick: true,
    });
  };
  handleCollectionShow = () => {
    document.getElementById("findLocationShow").style.display = "none";
    document.getElementById("likeLocationShow").style.display = "block";
    document.getElementById("likeList").style.display = "block";
    this.setState({
      btnClick: false,
    });
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
    this.setState({
      traffic: data,
    });
  };
  handleTraffic = (traffic) => {
    this.setState({
      trafficDetail: traffic,
    });
  };

  handleDeleteLocation = (i, date) => {
    if (this.state.travelDetailCountry[date] !== undefined) {
      let travelDetailCountryTemp = { ...this.state.travelDetailCountry };
      let travelMorningTemp = [...travelDetailCountryTemp[date]];
      travelMorningTemp.splice(i, 1);
      travelDetailCountryTemp[date] = travelMorningTemp;

      this.setState({
        travelDetailCountry: travelDetailCountryTemp,
      });
      db.collection("schedule")
        .doc(this.state.userUid)
        .collection("data")
        .doc(`travel${window.location.pathname.substring(23)}`)
        .collection("dateBlockDetail")
        .doc(date)
        .set({
          morning: travelMorningTemp,
          name: date,
        });
    }

    if (i === this.state.travelDetailCountry[date].length - 1) {
      let obj = Object.assign({}, this.state.trafficDetail);
      obj[date].splice(i - 1, 1);
      this.handleTraffic(obj);
    }
  };

  handleShowLocationDrag = () => {
    if (this.state.showLocationSearch === false) {
      document.getElementById("locationDetail").style.display = "flex";
      document.getElementById("locationSection0").style.opacity = 1;
      document.getElementById("locationSection0").style.width = "300px";
      document.getElementById("locationList").style.width = "200px";
      document.getElementById("likeList").style.width = "200px";
      document.getElementById("searchAll").style.width = "200px";
      document.getElementById("searchAll").style.overflow = "visible";
      document.getElementById("switchBtn").style.opacity = 1;
      document.getElementById("switchBtn").style.width = "300px";
      document.getElementById("arrow").style.transform = "rotate(-180deg)";
      document.getElementById("arrow").style.transition = "0.3s";
      this.setState({ showLocationSearch: true });
    } else {
      document.getElementById("locationSection0").style.opacity = 0;
      document.getElementById("locationSection0").style.width = "0px";
      document.getElementById("locationList").style.width = "0px";
      document.getElementById("likeList").style.width = "0px";
      document.getElementById("searchAll").style.width = "0px";
      document.getElementById("searchAll").style.overflow = "hidden";
      document.getElementById("switchBtn").style.opacity = 0;
      document.getElementById("switchBtn").style.width = "0px";
      document.getElementById("arrow").style.transition = "0.3s";
      document.getElementById("arrow").style.transform = "rotate(0deg)";
      this.setState({ showLocationSearch: false });
    }
  };

  render() {
    const titleData = this.state.titleData;
    console.log(this.state.travelDetailCountry);
    return (
      <div className={styles.scheduleWithMap}>
        <div className={styles.schedule}>
          <div className={styles.switchBtn} id="switchBtn">
            <button
              onClick={this.handleLocationShow}
              className={this.state.btnClick ? styles.btnClick : styles.btn}
            >
              <span>景點搜尋</span>
              <div className={`${styles.triangle} ${styles.t1}`}></div>
              <div className={`${styles.triangle} ${styles.t2}`}></div>
            </button>

            <button
              onClick={this.handleCollectionShow}
              className={this.state.btnClick ? styles.btn : styles.btnClick}
            >
              <span>我的收藏</span>
              <div className={`${styles.triangle} ${styles.t1}`}></div>
              <div className={`${styles.triangle} ${styles.t2}`}></div>
            </button>
          </div>

          <div key={titleData.id} className={styles.scheduleListTopLeft}>
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
                src={titleData.CoverImgUrl}
              />

              <div className={styles.scheduleTitle}>
                {titleData.TravelScheduleName}
              </div>
              <div className={styles.date}>
                {titleData.StartDate} ～{" "}
                <span className={styles.date2}>{titleData.EndDate}</span>
              </div>
              <div className={styles.scheduleLayer}></div>
            </div>
          </div>

          <DragDropContext
            onDragEnd={this.onDragEnd}
            onDragStart={this.onDragStart}
          >
            {this.state.userUid && (
              <DropSchedule
                getCountry={this.getCountry}
                setInfoOpen={this.setInfoOpen}
                selectedPlace={this.state.selectedPlace}
                setSelectedPlace={this.setSelectedPlace}
                traffic={this.state.traffic}
                handleTraffic={this.handleTraffic}
                trafficDetail={this.state.trafficDetail}
                userUid={this.state.userUid}
                travelDateDetail={this.state.travelDateDetail}
                travelDetailCountry={this.state.travelDetailCountry}
                handleDeleteLocation={this.handleDeleteLocation}
                dragging={this.state.dragging}
              />
            )}
          </DragDropContext>
        </div>

        <div className={styles.scheduleMap}>
          <ScheduleMap
            travelDateDetail={this.state.travelDateDetail}
            infoOpen={this.state.infoOpen}
            setInfoOpen={this.setInfoOpen}
            selectedPlace={this.state.selectedPlace}
            setSelectedPlaceMarker={this.setSelectedPlaceMarker}
            travelShowId={this.state.travelShowId}
            showTraffic={this.showTraffic}
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
