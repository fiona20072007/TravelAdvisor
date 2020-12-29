import React from "react";
import styles from "../scss/schedule.module.scss";
import TrafficSchedule from "./TrafficSchedule";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";

class DragListSchedule extends React.Component {
  render() {
    return (
      <div>
        {this.props.travelDetailCountry[this.props.item] === undefined && (
          <div className={styles.emptyList}>Drop Here!</div>
        )}
        {this.props.travelDetailCountry[this.props.item] &&
          this.props.travelDetailCountry[this.props.item].length === 0 && (
            <div className={styles.emptyList}>Drop Here!</div>
          )}
        {this.props.travelDetailCountry[this.props.item] &&
          this.props.travelDetailCountry[this.props.item].map((item, i) => {
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
                        x
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
                            width: this.props.handleStar(item.star_level),
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Draggable>

                {this.props.traffic[this.props.item] !== undefined &&
                  i < this.props.traffic[this.props.item].length && (
                    <TrafficSchedule
                      traffic={this.props.traffic}
                      date={this.props.item}
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
  item: PropTypes.string,
  travelDetailCountry: PropTypes.object,
  date: PropTypes.string,
  setInfoOpen: PropTypes.func,
  setSelectedPlace: PropTypes.func,
  traffic: PropTypes.object,
  handleTraffic: PropTypes.func,
  trafficDetail: PropTypes.object,
  userUid: PropTypes.string,
  handleStar: PropTypes.func,
  handleDeleteLocation: PropTypes.func,
  dragging: PropTypes.bool,
};

export default DragListSchedule;
