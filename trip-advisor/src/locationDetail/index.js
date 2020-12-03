import React from "react";
import firebase from "../firebase";
import AsyncSelect from "react-select/async";
import Show from "./show";
import SimpleMap from "./map";
import styles from "../scss/locationDetail.module.scss";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";

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
      locationArray: [],
      locationArrayT: [],
    };
  }
  componentDidMount = () => {
    db.collection("country")
      .doc(this.props.match.params.tags)
      .collection("location")
      .get()
      .then((doc) => {
        // .onSnapshot(querySnapshot => {
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
        let locationArrayTemp = locationDetailTemp.map((item, i) => {
          return (
            <div
              key={item.id}
              id={item.id}
              data-column={Math.floor(i / 3)}
              onClick={(event) =>
                this.markerClickHandler(event, item, Math.floor(i / 3))
              }
              className={styles.item}
            >
              <img src={item.photo} className={styles.itemPhoto}></img>
              <div className={styles.itemName}>{item.name}</div>
              <div>{item.star_level}</div>
            </div>
          );
        });

        this.setState({
          locationDetail: locationDetailTemp,
          locationArray: locationArrayTemp,
          locationArrayT: locationArrayTemp,
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
      });
  };

  loadOptions = async (inputValue) => {
    inputValue = inputValue.toLowerCase().replace(/\W/g, "");
    return new Promise((resolve) => {
      db.collection("country")
        .doc(this.props.match.params.tags)
        .collection("location")
        .orderBy("plainName")
        .startAt(inputValue)
        .endAt(inputValue + "\uf8ff")
        .get()
        .then((docs) => {
          if (!docs.empty) {
            let recommendedTags = [];
            docs.forEach(function (doc) {
              const tag = {
                value: doc.id,
                label: doc.data().tagName,
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

  handleOnChange = (tags) => {
    this.state.locationDetail.map((item, i) => {
      if (tags.value === item.name) {
        let locationArrayTemp = [...this.state.locationArrayT];
        let showId = nanoid();
        locationArrayTemp.splice(
          Math.floor(i / 3) * 3 + 3,
          0,
          <div
            key={showId}
            id="show"
            // onClick={event => props.markerClickHandler(event, item)}
            className={styles.itemSelect}
          >
            <img src={item.photo} className={styles.itemSelectPhoto}></img>
            <div className={styles.selectDetail}>
              <div className={styles.itemName}>{item.name}</div>
              <div>{item.address}</div>
              <div>{item.telephone}</div>
              <div>{item.star_level}</div>
            </div>
          </div>
        );

        this.setState({
          selectedPlace: item,
          locationArray: locationArrayTemp,
        });
      }
    });
    if (this.state.infoOpen) {
      this.setState({
        infoOpen: false,
      });
    }
    this.setState({
      infoOpen: true,
    });
    if (this.state.zoom < 13) {
      this.setState({
        zoom: 13,
      });
    }
    window.setTimeout(
      () =>
        document.getElementById("show").scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        }),
      10
    );
  };

  markerClickHandler = (event, place, n) => {
    let locationArrayTemp = [...this.state.locationArrayT];
    let showId = nanoid();
    locationArrayTemp.splice(
      n * 3 + 3,
      0,
      <div
        key={showId}
        id="show"
        // onClick={event => props.markerClickHandler(event, item)}
        className={styles.itemSelect}
      >
        <img src={place.photo} className={styles.itemSelectPhoto}></img>
        <div className={styles.selectDetail}>
          <div className={styles.itemName}>{place.name}</div>
          <div>{place.address}</div>
          <div>{place.telephone}</div>
          <div>{place.star_level}</div>
        </div>
      </div>
    );

    // Remember which place was clicked
    this.setState({
      selectedPlace: place,
      locationArray: locationArrayTemp,
      // center: place.pos
    });
    // Required so clicking a 2nd marker works as expected
    if (this.state.infoOpen) {
      this.setState({
        infoOpen: false,
      });
    }
    this.setState({
      infoOpen: true,
    });
    // zoom in a little on marker click
    if (this.state.zoom < 13) {
      this.setState({
        zoom: 13,
      });
    }

    window.setTimeout(
      () =>
        document.getElementById("show").scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        }),
      10
    );
  };

  setInfoOpen = (state) => {
    this.setState({
      infoOpen: state,
    });
  };

  render() {
    return (
      <div className={styles.locationAll}>
        <div className={styles.left}>
          <div className={styles.title}>挑選景點</div>
          <AsyncSelect
            className={styles.locationInput}
            loadOptions={this.loadOptions}
            onChange={this.handleOnChange}
          />

          <Show
            locationArray={this.state.locationArray}
            locationBanner={this.state.locationBanner}
          />
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
};

export default LocationDetail;
