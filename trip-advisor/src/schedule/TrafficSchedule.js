import React from "react";
// import styles from "../scss/schedule.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

import PropTypes from "prop-types";

class TrafficSchedule extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.traffic[this.props.date][this.props.num].routes[0].legs[0]
            .distance.text
        }
        <br />
        <FontAwesomeIcon icon={faCar} />
        {
          this.props.traffic[this.props.date][this.props.num].routes[0].legs[0]
            .duration.text
        }
      </div>
    );
  }
}

TrafficSchedule.propTypes = {
  traffic: PropTypes.object,
  date: PropTypes.string,
  num: PropTypes.number,
};

export default TrafficSchedule;
