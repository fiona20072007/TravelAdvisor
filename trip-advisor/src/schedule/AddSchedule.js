import React from "react";
// import firebase from "../firebase";
// import styles from "../scss/location.module.scss";
// import PropTypes from "prop-types";

class AddSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = (event) => {
    alert("A name was submitted: " + this.state.value);
    event.preventDefault();
    this.setState({ value: "" });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Please enter trip name:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

// AddSchedule.propTypes = {
//   TravelSchedule: PropTypes.array.isRequired
// };

export default AddSchedule;
