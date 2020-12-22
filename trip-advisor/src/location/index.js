import React from "react";
import firebase from "../firebase";
import AsyncSelect from "react-select/async";
import LocationShow from "./locationShow";
import styles from "../scss/location.module.scss";
import PropTypes from "prop-types";
// import $ from "jquery";

const db = firebase.firestore();

class LocationIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTag: [],
      indexLocation: [],
      // memberLoginState: false
    };
  }
  componentDidMount = () => {
    // console.log(window.location.pathname);
    if (window.location.pathname === "/") {
      document.querySelectorAll("svg").forEach((item) => {
        item.style.color = "white";
      });
      document.querySelectorAll("a").forEach((item) => {
        item.style.color = "white";
      });
      document.querySelector("nav").style.backgroundColor = "transparent";
      document.querySelector("nav").style.boxShadow = "0 0 0";
    }
    db.collection("indexCountry").onSnapshot((querySnapshot) => {
      let indexLocationTemp = [];
      querySnapshot.forEach(function (doc) {
        indexLocationTemp.push({
          name: doc.data().name,
          description: doc.data().description,
          photo: doc.data().photo,
        });
      });
      this.setState({
        indexLocation: indexLocationTemp,
      });
    });
  };

  loadOptions = async (inputValue) => {
    // inputValue = inputValue.toLowerCase().replace(/\W/g, "");
    return new Promise((resolve) => {
      db.collection("indexCountry")
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

  handleOnChange = (tags) => {
    this.props.history.push(`/locationDetail/${tags.label}`);
  };

  render() {
    return (
      <div className={styles.locationAll}>
        <div className={styles.banner}></div>
        {/* <div className={styles.title}> */}
        {/* Choose One ! */}
        <div className={styles.content}>
          <div className={styles.content__container}>
            <p className={styles.content__container__text}>Hello</p>

            <ul className={styles.content__container__list}>
              <li className={styles.content__container__list__item}>
                Taipei !
              </li>
              <li className={styles.content__container__list__item}>Paris !</li>
              <li className={styles.content__container__list__item}>
                Munich !
              </li>
              <li className={styles.content__container__list__item}>
                Singapore !
              </li>
              {/* <li className={styles.content__container__list__item}>Tokyo !</li>
              <li className={styles.content__container__list__item}>
                NewYork !
              </li> */}
            </ul>
          </div>
        </div>
        {/* </div> */}

        <AsyncSelect
          className={styles.locationInput}
          loadOptions={this.loadOptions}
          onChange={this.handleOnChange}
        />

        <LocationShow
          indexLocation={this.state.indexLocation}
          handleOnChange={this.handleOnChange}
        />
      </div>
    );
  }
}

LocationIndex.propTypes = {
  history: PropTypes.object.isRequired,
};

export default LocationIndex;
