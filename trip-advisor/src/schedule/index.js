import React from "react";
import firebase from "../firebase";
import AddSchedule from "./AddSchedule";
// import styles from "../scss/location.module.scss";
// import PropTypes from "prop-types";

const db = firebase.firestore();

class ScheduleIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      TravelSchedule: [],
    };
  }

  componentDidMount = () => {
    db.collection("schedule")
      .doc("userId")
      .collection("data")
      .onSnapshot((querySnapshot) => {
        let TravelScheduleTemp = [];
        querySnapshot.forEach((doc) => {
          TravelScheduleTemp.push(doc.data());
        });
        this.setState({
          TravelSchedule: TravelScheduleTemp,
        });
      });

    //   .doc("TravelSchedule")
    //   .get()
    //   .then(doc => {
    //     this.setState({
    //       TravelSchedule: doc.data()
    //     });
    //   });
  };

  //   loadOptions = async inputValue => {
  //     inputValue = inputValue.toLowerCase().replace(/\W/g, "");
  //     return new Promise(resolve => {
  //       db.collection("Tag")
  //         .orderBy("plainName")
  //         .startAt(inputValue)
  //         .endAt(inputValue + "\uf8ff")
  //         .get()
  //         .then(docs => {
  //           if (!docs.empty) {
  //             let recommendedTags = [];
  //             docs.forEach(function(doc) {
  //               const tag = {
  //                 value: doc.id,
  //                 label: doc.data().tagName
  //               };
  //               recommendedTags.push(tag);
  //             });
  //             return resolve(recommendedTags);
  //           } else {
  //             return resolve([]);
  //           }
  //         });
  //     });
  //   };

  //   handleOnChange = tags => {
  //     this.props.history.push(`/locationDetail/${tags.label}`);
  //   };

  render() {
    console.log(this.state.TravelSchedule);
    return (
      <div>
        <AddSchedule TravelSchedule={this.state.TravelSchedule} />
      </div>
    );
  }
}

export default ScheduleIndex;
