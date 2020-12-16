import React from "react";
import firebase from "../firebase";
import AsyncSelect from "react-select/async";
import LocationShow from "./locationShow";
// import MemberIndex from "../member";
import styles from "../scss/location.module.scss";
import PropTypes from "prop-types";

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
    inputValue = inputValue.toLowerCase().replace(/\W/g, "");
    return new Promise((resolve) => {
      db.collection("Tag")
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
    this.props.history.push(`/locationDetail/${tags.label}`);
  };

  render() {
    return (
      <div className={styles.locationAll}>
        <div className={styles.banner}></div>
        <div className={styles.title}>Choose One !</div>
        <AsyncSelect
          className={styles.locationInput}
          loadOptions={this.loadOptions}
          onChange={this.handleOnChange}
        />

        <LocationShow
          indexLocation={this.state.indexLocation}
          handleOnChange={this.handleOnChange}
        />
        {/* {this.state.memberLoginState === true && <MemberIndex />} */}
      </div>
    );
  }
}

LocationIndex.propTypes = {
  history: PropTypes.object.isRequired,
};

export default LocationIndex;
