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
  getLikeList,
  setSchedule,
} from "../Utils";

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
      switchToLocationSearchShow: true,
      travelDetailCountry: {},
      dragging: false,
      repeatDragCardId: "",
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

      let travelDetailCountryTemp = {};
      getTravelScheduleData(user.uid, travelShowId).then((docs) => {
        docs.forEach((doc) => {
          travelDetailCountryTemp[doc.data().name] = doc.data().morning;
        });
        this.setState({
          travelDetailCountry: travelDetailCountryTemp,
        });
        document.getElementById("loading").style.display = "none";
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.travelDetailCountry !== this.state.travelDetailCountry) {
      let locationSpot = new Object();

      Object.keys(this.state.travelDetailCountry).forEach((date) => {
        let arr = [];
        if (this.state.travelDetailCountry[date].length > 1) {
          let morningArray = this.state.travelDetailCountry[date];
          for (let i = 0; i < morningArray.length - 1; i++) {
            let obj = {};

            obj["origin"] = new window.google.maps.LatLng(
              morningArray[i].pos.lat,
              morningArray[i].pos.lng
            );
            obj["destination"] = new window.google.maps.LatLng(
              morningArray[i + 1].pos.lat,
              morningArray[i + 1].pos.lng
            );
            obj["travelMode"] = "DRIVING";
            obj["id"] = i;
            arr.push(obj);
          }
        }
        locationSpot[date] = arr;
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
      repeatDragCardId: "",
    });

    const { draggableId } = result;
    const dragCardCategory = draggableId.substr(0, 1);
    const dragCardId = draggableId.substring(3);

    Object.keys(this.state.travelDetailCountry).forEach((date) => {
      if (this.state.travelDetailCountry[date].length !== 0) {
        this.state.travelDetailCountry[date].forEach((obj) => {
          if (obj.id === draggableId.substr(3)) {
            this.setState({
              repeatDragCardId: obj.id,
            });
          }
        });
      }
    });

    if (dragCardCategory === "i") {
      getLocationDetail(this.state.searchCountry).then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().id === dragCardId) {
            let obj = {
              country: this.state.searchCountry,
              name: doc.data().name,
              id: doc.data().id,
              photo: doc.data().PointImgUrl,
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
      getLikeList(this.state.userUid).then((docAll) => {
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
        travelDetailCountryTemp[destinationDroppableId] = travelMorningTemp;
        this.setState({
          travelDetailCountry: travelDetailCountryTemp,
        });

        setSchedule(
          this.state.userUid,
          this.state.travelShowId,
          destinationDroppableId,
          travelMorningTemp
        );
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

        travelDetailCountryTemp[sourceDroppableId] = travelMorningDragTemp;
        travelDetailCountryTemp[destinationDroppableId] = travelMorningDropTemp;
        this.setState({
          travelDetailCountry: travelDetailCountryTemp,
        });

        setSchedule(
          this.state.userUid,
          this.state.travelShowId,
          sourceDroppableId,
          travelMorningDragTemp
        );

        setSchedule(
          this.state.userUid,
          this.state.travelShowId,
          destinationDroppableId,
          travelMorningDropTemp
        );
      }
    }

    if (dragCardCategory === "i" || dragCardCategory === "L") {
      let travelMorningTemp = [];

      if (this.state.repeatDragCardId !== "") {
        document.getElementById("alert").style.display = "flex";
        window.setTimeout(
          () => (document.getElementById("alert").style.display = "none"),
          1500
        );
        return;
      }
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

      travelDetailCountryTemp[destinationDroppableId] = travelMorningTemp;
      this.setState({
        travelDetailCountry: travelDetailCountryTemp,
      });

      setSchedule(
        this.state.userUid,
        this.state.travelShowId,
        destinationDroppableId,
        travelMorningTemp
      );
    }
  };

  handleLocationShow = (state) => {
    this.setState({
      switchToLocationSearchShow: state,
    });
  };

  setInfoOpen = (state) => {
    this.setState({
      infoOpen: state,
    });
  };

  setSelectedPlaceMarker = (item) => {
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
      setSchedule(
        this.state.userUid,
        this.state.travelShowId,
        date,
        travelMorningTemp
      );
    }

    if (i === this.state.travelDetailCountry[date].length - 1) {
      let obj = Object.assign({}, this.state.trafficDetail);
      obj[date].splice(i - 1, 1);
      this.handleTraffic(obj);
    }
  };

  handleShowLocationDrag = () => {
    if (this.state.showLocationSearch === false) {
      this.setState({ showLocationSearch: true });
    } else {
      this.setState({ showLocationSearch: false });
    }
  };

  render() {
    const titleData = this.state.titleData;
    return (
      <div className={styles.scheduleWithMap}>
        <div className={styles.schedule}>
          <div
            className={
              this.state.showLocationSearch
                ? styles.switchBtnClick
                : styles.switchBtn
            }
          >
            <button
              onClick={() => this.handleLocationShow(true)}
              className={
                this.state.switchToLocationSearchShow
                  ? styles.btnClick
                  : styles.btn
              }
            >
              <span>景點搜尋</span>
              <div className={`${styles.triangle} ${styles.t1}`}></div>
              <div className={`${styles.triangle} ${styles.t2}`}></div>
            </button>

            <button
              onClick={() => this.handleLocationShow(false)}
              className={
                this.state.switchToLocationSearchShow
                  ? styles.btn
                  : styles.btnClick
              }
            >
              <span>我的收藏</span>
              <div className={`${styles.triangle} ${styles.t1}`}></div>
              <div className={`${styles.triangle} ${styles.t2}`}></div>
            </button>
          </div>

          <div key={titleData.id} className={styles.scheduleListTopLeft}>
            <div className={styles.scheduleListDetailTopLeft}>
              <div
                className={
                  this.state.showLocationSearch
                    ? styles.arrowBounce
                    : styles.arrowBounceRotate
                }
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
                setSelectedPlace={this.setSelectedPlaceMarker}
                traffic={this.state.traffic}
                handleTraffic={this.handleTraffic}
                trafficDetail={this.state.trafficDetail}
                userUid={this.state.userUid}
                travelDetailCountry={this.state.travelDetailCountry}
                handleDeleteLocation={this.handleDeleteLocation}
                dragging={this.state.dragging}
                switchToLocationSearchShow={
                  this.state.switchToLocationSearchShow
                }
                showLocationSearch={this.state.showLocationSearch}
              />
            )}
          </DragDropContext>
        </div>

        <div className={styles.scheduleMap}>
          <ScheduleMap
            travelDetailCountry={this.state.travelDetailCountry}
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
