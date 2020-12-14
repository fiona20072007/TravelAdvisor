import React from "react";
import firebase from "../firebase";
import AsyncSelect from "react-select/async";
import LocationShow from "./locationShow";
import MemberIndex from "../member";
import styles from "../scss/location.module.scss";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const db = firebase.firestore();

class LocationIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTag: [],
      indexLocation: [],
      memberLoginState: false,
    };
  }
  componentDidMount = () => {
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
        <div className={styles.navBar}>三</div>
        <div className={styles.navBarList}>
          <Link to="/">Home</Link>
          <Link to="/schedule">行程規劃</Link>
          {/* <Link to="/member">會員登入</Link> */}
          <div
            onClick={() => {
              this.setState((prevState) => ({
                memberLoginState: !prevState.memberLoginState,
              }));
            }}
          >
            會員登入
          </div>
        </div>
        <div className={styles.banner}></div>
        <div className={styles.title}>挑選地點</div>
        <AsyncSelect
          className={styles.locationInput}
          loadOptions={this.loadOptions}
          onChange={this.handleOnChange}
        />

        <LocationShow
          indexLocation={this.state.indexLocation}
          handleOnChange={this.handleOnChange}
        />
        {this.state.memberLoginState === true && <MemberIndex />}
      </div>
    );
  }
}

LocationIndex.propTypes = {
  history: PropTypes.object.isRequired,
};

export default LocationIndex;
