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
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: "",
    };
  }
  filterSelectedData = function (data) {
    let obj = Object.assign({}, this.props.trafficDetail);
    obj[this.props.date][this.props.num].travelMode = data.value;
    this.props.handleTraffic(obj);
    // console.log(obj);
    this.setState({
      selectedFilter: data,
    });
  };
  render() {
    // console.log(this.props.traffic);
    return (
      this.props.traffic[this.props.date][this.props.num] !== undefined && (
        <div className={styles.trafficLength}>
          {
            this.props.traffic[this.props.date][this.props.num].routes[0]
              .legs[0].distance.text
          }
          <br />
          <div className={styles.itemTraffic}>
            <Select
              value={this.state.selectedFilter}
              onChange={(e) => this.filterSelectedData(e)}
              options={filterFiedsOptions}
              placeholder={<FontAwesomeIcon icon={faCar} title={"DRIVING"} />}
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
};

export default TrafficSchedule;
