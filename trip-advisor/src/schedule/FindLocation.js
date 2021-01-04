import React from "react";
import FindLocationCard from "./FindLocationCard";
import PropTypes from "prop-types";
import firebase from "../firebase";
import AsyncSelect from "react-select/async";
import styles from "../scss/schedule.module.scss";
import {
  setLikeListEmpty,
  searchLoadOptions,
  getLocationDetail,
} from "../Utils";

const db = firebase.firestore();

class FindLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      countryId: "",
      locationArray: [],
      likeList: [],
    };
    this.options = [
      { value: "台北", label: "台北" },
      { value: "巴黎", label: "巴黎" },
      { value: "慕尼黑", label: "慕尼黑" },
      { value: "新加坡", label: "新加坡" },
      { value: "東京", label: "東京" },
      { value: "紐約", label: "紐約" },
    ];
  }

  componentDidMount() {
    db.collection("schedule")
      .doc(this.props.userUid)
      .onSnapshot((doc) => {
        if (doc.data()["like"] === undefined) {
          setLikeListEmpty(this.props.userUid);
        } else {
          this.setState({ likeList: doc.data()["like"] });
        }
      });
  }

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

  handleOnChangeCountry = (e) => {
    this.props.getCountry(e.label);
    this.setState({
      value: e.label,
    });
    getLocationDetail(e.label).then((doc) => {
      let locationDetailTemp = [];
      doc.forEach(function (doc) {
        locationDetailTemp.push({
          name: doc.data().name,
          country: doc.data().Country,
          photo: doc.data().PointImgUrl,
          pos: {
            lat: parseFloat(doc.data().latitude, 10),
            lng: parseFloat(doc.data().longitude, 10),
          },
          star_level: doc.data().star_level,
          id: parseInt(doc.data().id),
        });
      });

      this.setState({
        locationArray: locationDetailTemp,
      });
    });
  };

  handleOnChange(id) {
    document.getElementById(id).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  render() {
    return (
      <div>
        <div
          className={
            this.props.showLocationSearch
              ? styles.searchAllShow
              : styles.searchAll
          }
        >
          <div>
            <div className={styles.title}>挑選國家</div>
            <AsyncSelect
              className={styles.locationInput}
              loadOptions={searchLoadOptions}
              onChange={(e) => this.handleOnChangeCountry(e)}
              defaultOptions={this.options}
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

        <div
          className={
            this.props.showLocationSearch
              ? styles.locationListShow
              : styles.locationList
          }
        >
          {this.state.locationArray.map((item, i) => {
            return (
              <FindLocationCard
                key={i}
                locationDetail={item}
                userUid={this.props.userUid}
                likeList={this.state.likeList}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

FindLocation.propTypes = {
  getCountry: PropTypes.func,
  userUid: PropTypes.string,
  showLocationSearch: PropTypes.bool,
};

export default FindLocation;
