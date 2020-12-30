import React from "react";
import styles from "../scss/schedule.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faWalking,
  faSubway,
  faBicycle,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import PropTypes from "prop-types";

const filterFiedsOptions = [
  {
    value: "DRIVING",
    label: <FontAwesomeIcon icon={faCar} title={"DRIVING"} />,
  },
  {
    value: "WALKING",
    label: <FontAwesomeIcon icon={faWalking} title={"WALKING"} />,
  },
  {
    value: "TRANSIT",
    label: <FontAwesomeIcon icon={faSubway} title={"TRANSIT"} />,
  },
  {
    value: "BICYCLING",
    label: <FontAwesomeIcon icon={faBicycle} title={"BICYCLING"} />,
  },
];

class TrafficSchedule extends React.Component {
  filterSelectedData = function (data) {
    let obj = Object.assign({}, this.props.trafficDetail);
    obj[this.props.date][this.props.num].travelMode = data.value;
    this.props.handleTraffic(obj);
  };
  handleTrafficMethod = () => {
    if (
      this.props.trafficDetail[this.props.date][this.props.num] !== undefined
    ) {
      return filterFiedsOptions.find(
        (item) =>
          item.value ===
          this.props.trafficDetail[this.props.date][this.props.num].travelMode
      );
    }
  };
  render() {
    return (
      this.props.traffic[this.props.date][this.props.num] !== undefined && (
        <div
          // className={styles.trafficLength}
          className={
            this.props.dragging
              ? styles.trafficLengthHide
              : styles.trafficLength
          }
        >
          {
            this.props.traffic[this.props.date][this.props.num].routes[0]
              .legs[0].distance.text
          }
          <br />
          <div
            // className={styles.itemTraffic}
            className={
              this.props.dragging ? styles.itemTrafficHide : styles.itemTraffic
            }
          >
            <Select
              value={
                //   filterFiedsOptions.find(
                //   item =>
                //     item.value ===
                //     this.props.trafficDetail[this.props.date][this.props.num]
                //       .travelMode
                // )
                this.handleTrafficMethod()
              }
              onChange={(e) => this.filterSelectedData(e)}
              options={filterFiedsOptions}
              className={styles.itemSelect}
            />
            {
              this.props.traffic[this.props.date][this.props.num].routes[0]
                .legs[0].duration.text
            }
          </div>
        </div>
      )
    );
  }
}

TrafficSchedule.propTypes = {
  traffic: PropTypes.object,
  date: PropTypes.string,
  num: PropTypes.number,
  handleTraffic: PropTypes.func,
  trafficDetail: PropTypes.object,
  dragging: PropTypes.bool,
};

export default TrafficSchedule;
