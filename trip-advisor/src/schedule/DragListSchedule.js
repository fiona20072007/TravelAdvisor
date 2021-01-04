import React from "react";
import styles from "../scss/schedule.module.scss";
import TrafficSchedule from "./TrafficSchedule";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";
import { handleStar } from "../Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

class DragListSchedule extends React.PureComponent {
  render() {
    return (
      <div>
        {this.props.travelDetailCountry[this.props.date] &&
          this.props.travelDetailCountry[this.props.date].length === 0 && (
            <div
              className={
                this.props.dragging ? styles.emptyListHide : styles.emptyList
              }
            >
              Drop Here!
            </div>
          )}
        {this.props.travelDetailCountry[this.props.date].map((item, i) => {
          return (
            <div key={item.id}>
              <Draggable draggableId={`Id-${item.id}`} index={i}>
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className={styles.itemList}
                    onMouseOver={() =>
                      (document.getElementById(
                        `delete-${item.id}`
                      ).style.display = "block")
                    }
                    onMouseLeave={() =>
                      (document.getElementById(
                        `delete-${item.id}`
                      ).style.display = "none")
                    }
                    onClick={() => {
                      this.props.setInfoOpen(true);
                      this.props.setSelectedPlace(item);
                    }}
                  >
                    <div
                      className={styles.itemListDelete}
                      id={`delete-${item.id}`}
                      onClick={() => {
                        this.props.handleDeleteLocation(i, this.props.date);
                      }}
                    >
                      <FontAwesomeIcon icon={faWindowClose} />
                    </div>
                    <img
                      src={item.PointImgUrl}
                      className={styles.itemPhoto}
                    ></img>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.ratings}>
                      <div className={styles["empty-stars"]}></div>
                      <div
                        className={styles["full-stars"]}
                        style={{
                          width: handleStar(item.star_level),
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </Draggable>

              {this.props.traffic[this.props.date] !== undefined &&
                i < this.props.traffic[this.props.date].length && (
                  <TrafficSchedule
                    traffic={this.props.traffic}
                    date={this.props.date}
                    num={i}
                    handleTraffic={this.props.handleTraffic}
                    trafficDetail={this.props.trafficDetail}
                    dragging={this.props.dragging}
                  />
                )}
            </div>
          );
        })}
      </div>
    );
  }
}

DragListSchedule.propTypes = {
  travelDetailCountry: PropTypes.object,
  date: PropTypes.string,
  setInfoOpen: PropTypes.func,
  setSelectedPlace: PropTypes.func,
  traffic: PropTypes.object,
  handleTraffic: PropTypes.func,
  trafficDetail: PropTypes.object,
  userUid: PropTypes.string,
  handleDeleteLocation: PropTypes.func,
  dragging: PropTypes.bool,
};

export default DragListSchedule;
