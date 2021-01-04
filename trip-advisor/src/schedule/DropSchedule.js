import React from "react";
import styles from "../scss/schedule.module.scss";
import FindLocation from "./FindLocation";
import LikeLocation from "./LikeLocation";
import DragListSchedule from "./DragListSchedule";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Droppable } from "react-beautiful-dnd";

class DropSchedule extends React.Component {
  handleDateScroll = (id) => {
    document.getElementById(`day${id + 1}`).scrollIntoView({
      behavior: "smooth",
    });
  };

  render() {
    return (
      <div className={styles.scheduleDateAll}>
        <div className={styles.scheduleDateSelect}>
          <FontAwesomeIcon icon={faCalendarAlt} />
          <div className={styles.scheduleDateTitle}>Day </div>
          {Object.keys(this.props.travelDetailCountry).map((item, i) => {
            return (
              <div
                key={i}
                className={styles.scheduleDateDetail}
                onClick={() => {
                  this.handleDateScroll(i);
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        {Object.keys(this.props.travelDetailCountry).map((date, i) => (
          <Droppable droppableId={`drop-${date}`} key={i}>
            {(provided) => (
              <div className={styles.scheduleDetailForDrop}>
                <div className={styles.scheduleDateOnly} id={`day${i + 1}`}>
                  {`\xa0\xa0\xa0\xa0`}Day-{i + 1} {`\xa0\xa0\xa0\xa0`} {date}
                </div>
                <div
                  className={styles.scheduleDetail}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <DragListSchedule
                    date={date}
                    travelDetailCountry={this.props.travelDetailCountry}
                    setInfoOpen={this.props.setInfoOpen}
                    selectedPlace={this.props.selectedPlace}
                    setSelectedPlace={this.props.setSelectedPlace}
                    traffic={this.props.traffic}
                    handleTraffic={this.props.handleTraffic}
                    trafficDetail={this.props.trafficDetail}
                    userUid={this.props.userUid}
                    handleDeleteLocation={this.props.handleDeleteLocation}
                    dragging={this.props.dragging}
                  />

                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
        <Droppable droppableId={"locationList"}>
          {(provided) => (
            <div
              className={
                this.props.showLocationSearch
                  ? styles.locationSectionShow
                  : styles.locationSection
              }
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div
                className={
                  this.props.switchToLocationSearchShow
                    ? styles.listShow
                    : styles.displayNone
                }
              >
                <FindLocation
                  getCountry={this.props.getCountry}
                  userUid={this.props.userUid}
                  showLocationSearch={this.props.showLocationSearch}
                />
              </div>

              <div
                className={
                  this.props.switchToLocationSearchShow
                    ? styles.displayNone
                    : styles.listShow
                }
              >
                <LikeLocation
                  userUid={this.props.userUid}
                  showLocationSearch={this.props.showLocationSearch}
                />
              </div>
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

DropSchedule.propTypes = {
  getCountry: PropTypes.func,
  setInfoOpen: PropTypes.func,
  selectedPlace: PropTypes.object,
  setSelectedPlace: PropTypes.func,
  traffic: PropTypes.object,
  handleTraffic: PropTypes.func,
  trafficDetail: PropTypes.object,
  userUid: PropTypes.string,
  travelDetailCountry: PropTypes.object,
  handleDeleteLocation: PropTypes.func,
  dragging: PropTypes.bool,
  switchToLocationSearchShow: PropTypes.bool,
  showLocationSearch: PropTypes.bool,
};

export default DropSchedule;
