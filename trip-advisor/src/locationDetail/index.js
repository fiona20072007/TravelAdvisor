import React from "react";
import firebase from "../firebase";
import AsyncSelect from "react-select/async";
import Card from "./Card";
import DetailCard from "./DetailCard";
import SimpleMap from "./map";
import styles from "../scss/locationDetail.module.scss";
import PropTypes from "prop-types";
import { likeList } from "../Utils";

import {
  setNavbarColor,
  setLikeListEmpty,
  searchLocationLoadOptions,
  scrollIntoView,
} from "../Utils";

const db = firebase.firestore();

class LocationDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locationBanner: [],
      locationDetail: [],
      center: {},
      zoom: 15,
      selectedPlace: {},
      infoOpen: false,
      likeList: [],
      userUid: "",
      detailCardNum: false,
    };
  }
  shouldComponentUpdate(nextProps) {
    if (nextProps.match !== this.props.match) {
      return false;
    } else {
      return true;
    }
  }
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          userUid: user.uid,
        });

        likeList(user.uid).onSnapshot((doc) => {
          if (doc.data()["like"] === undefined) {
            setLikeListEmpty(user.uid);
          } else {
            this.setState({ likeList: doc.data()["like"] });
          }
        });
      } else {
        document.getElementById("loading").style.display = "none";

        this.props.history.push("/member");
      }
    });

    setNavbarColor("location");

    db.collection("country")
      .doc(this.props.match.params.tags)
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
        this.setState({
          locationDetail: locationDetailTemp,
        });
      });
    db.collection("indexCountry")
      .get()
      .then((doc) => {
        let locationBannerTemp;
        let centerTemp;
        let zoomTemp;
        doc.forEach((doc) => {
          if (doc.data().name === this.props.match.params.tags) {
            locationBannerTemp = {
              name: doc.data().name,
              description: doc.data().description,
              photo: doc.data().photo,
              latitude: parseFloat(doc.data().latitude, 10),
              longitude: parseFloat(doc.data().longitude, 10),
              zoom_level: parseFloat(doc.data().zoom_level, 10),
            };
            centerTemp = {
              lat: parseFloat(doc.data().latitude),
              lng: parseFloat(doc.data().longitude),
            };
            zoomTemp = parseFloat(doc.data().zoom_level);
          }
        });
        this.setState({
          locationBanner: locationBannerTemp,
          center: centerTemp,
          zoom: zoomTemp,
        });
        document.getElementById("loading").style.display = "none";
      });
  };

  handleInfoOpen = (infoOpenState) => {
    if (infoOpenState) {
      this.setState({
        infoOpen: false,
      });
    }
    this.setState({
      infoOpen: true,
    });
  };

  handleOnChange = (tags) => {
    this.state.locationDetail.map((item, i) => {
      if (tags.value === item.name) {
        this.setState({
          selectedPlace: item,
          detailCardNum: Math.floor(i / 3) + 1,
        });
      }
    });
    this.handleInfoOpen(this.state.infoOpen);
    if (this.state.zoom < 13) {
      this.setState({
        zoom: 13,
      });
    }
    scrollIntoView("show");
  };

  markerClickHandler = (event, place, n) => {
    if (event !== "path") {
      this.setState({
        selectedPlace: place,
        detailCardNum: n + 1,
      });
      this.handleInfoOpen(this.state.infoOpen);
      if (this.state.zoom < 13) {
        this.setState({
          zoom: 13,
        });
      }
      scrollIntoView("show");
    }
  };

  setInfoOpen = (state) => {
    this.setState({
      infoOpen: state,
    });
  };

  render() {
    console.log(12345);
    const showCardArr = this.state.locationDetail.map((item, i) => (
      <Card
        item={item}
        i={i}
        key={i}
        userId={this.state.userUid}
        likeList={this.state.likeList}
        markerClickHandler={(event) => {
          this.markerClickHandler(event, item, Math.floor(i / 3));
        }}
      />
    ));

    this.state.detailCardNum
      ? showCardArr.splice(
          this.state.detailCardNum * 3,
          0,
          <DetailCard place={this.state.selectedPlace} />
        )
      : showCardArr;

    return (
      <div className={styles.locationAll}>
        <div className={styles.left}>
          <div className={styles.title}>挑選景點</div>
          <AsyncSelect
            className={styles.locationInput}
            loadOptions={(inputValue) =>
              searchLocationLoadOptions(
                inputValue,
                this.props.match.params.tags
              )
            }
            onChange={this.handleOnChange}
            placeholder={<div>輸入想去的景點</div>}
          />
          <div className={styles.banner}>
            <div className={styles.bannerName}>
              {this.state.locationBanner.name}
            </div>
            <div className={styles.bannerDes}>
              {this.state.locationBanner.description}
            </div>
            <img
              className={styles.bannerPhoto}
              src={this.state.locationBanner.photo}
            />
          </div>
          <div className={styles.location}>
            <div className={styles.locationShow}>{showCardArr}</div>
          </div>
        </div>
        <div className={styles.right}>
          <SimpleMap
            locationDetail={this.state.locationDetail}
            locationBanner={this.state.locationBanner}
            center={this.state.center}
            zoom={this.state.zoom}
            selectedPlace={this.state.selectedPlace}
            infoOpen={this.state.infoOpen}
            markerClickHandler={this.markerClickHandler}
            setInfoOpen={this.setInfoOpen}
          />
        </div>
      </div>
    );
  }
}

LocationDetail.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object,
};

export default LocationDetail;
