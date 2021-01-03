import React from "react";
import PropTypes from "prop-types";
import styles from "../scss/schedule.module.scss";
import { Draggable } from "react-beautiful-dnd";
import { handleStar } from "../Utils";

class FindLocationCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  render() {
    return (
      <Draggable
        draggableId={`id-${this.props.locationDetail.id}`}
        index={this.props.locationDetail.id}
      >
        {(provided) => (
          <div
            id={this.props.locationDetail.id}
            className={styles.item}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onMouseOver={() => {
              document.getElementById(
                `likeSearch-${this.props.locationDetail.id}`
              ).style.display = "block";
              if (
                this.state.likeList.find(
                  (i) => i.id === this.props.locationDetail.id
                )
              ) {
                document.getElementById(
                  `likeSearch-${this.props.locationDetail.id}`
                ).style.fill = "rgb(255, 128, 191)";
                document.getElementById(
                  `likeSearch-${this.props.locationDetail.id}`
                ).style["fill-opacity"] = 1;
              } else {
                document.getElementById(
                  `likeSearch-${this.props.locationDetail.id}`
                ).style.fill = "rgb(255, 255, 255)";
                document.getElementById(
                  `likeSearch-${this.props.locationDetail.id}`
                ).style["fill-opacity"] = 0.3;
              }
            }}
            onMouseLeave={() => {
              if (
                this.state.likeList.find(
                  (i) => i.id === this.props.locationDetail.id
                )
              ) {
                return;
              } else {
                document.getElementById(
                  `likeSearch-${this.props.locationDetail.id}`
                ).style.display = "none";
              }
            }}
          >
            <div
              id={`likeSearch-${this.props.locationDetail.id}`}
              className={styles.searchLike}
              onClick={() => this.handleLike(this.props.locationDetail)}
            >
              <svg id="icon-heart" viewBox="0 0 32 32" width="30" height="20">
                <title>heart</title>
                <path d="M29.306 4.768c-1.662-1.66-3.958-2.687-6.493-2.687s-4.831 1.027-6.493 2.687l-0.32 0.32-0.32-0.32c-1.662-1.664-3.96-2.694-6.498-2.694-5.072 0-9.183 4.112-9.183 9.183 0 2.534 1.026 4.828 2.686 6.49l11.363 11.373c0.499 0.496 1.187 0.803 1.947 0.803s1.448-0.307 1.947-0.803l11.353-11.36c1.671-1.66 2.705-3.96 2.705-6.501 0-2.536-1.030-4.832-2.695-6.491l-0-0z"></path>
              </svg>
            </div>
            <img
              src={this.props.locationDetail.photo}
              className={styles.itemPhoto}
            ></img>
            <div className={styles.itemName}>
              {this.props.locationDetail.name}
            </div>
            <div className={styles.ratings}>
              <div className={styles["empty-stars"]}></div>
              <div
                className={styles["full-stars"]}
                style={{
                  width: handleStar(this.props.locationDetail.star_level),
                }}
              ></div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}

FindLocationCard.propTypes = {
  locationDetail: PropTypes.object,
};

export default FindLocationCard;
