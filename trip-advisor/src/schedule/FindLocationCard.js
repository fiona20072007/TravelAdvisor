import React from "react";
import PropTypes from "prop-types";
import styles from "../scss/schedule.module.scss";
import { Draggable } from "react-beautiful-dnd";
import { handleStar, setLikeDb } from "../Utils";

class FindLocationCard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      likeState: "hide",
    };
  }
  findLike = () => {
    const findLike = this.props.likeList.find(
      (item) => item.id === this.props.locationDetail.id
    );
    findLike !== undefined
      ? this.setState({ likeState: "showRed" })
      : this.setState({ likeState: "hide" });
  };
  componentDidMount() {
    this.findLike();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.likeList !== this.props.likeList) {
      this.findLike();
    }
  }

  handleLike = (likeItem) => {
    const likeAllArr = [...this.props.likeList];

    if (likeAllArr.length === 0) {
      likeAllArr.push(likeItem);
      setLikeDb(this.props.userUid, likeAllArr);
    } else {
      if (likeAllArr.find((item) => item.id === likeItem.id)) {
        this.setState({ likeState: "showGray" });
        const removeLikeAllArr = likeAllArr.filter(function (i) {
          return i.id !== likeItem.id;
        });
        setLikeDb(this.props.userUid, removeLikeAllArr);
      } else {
        this.setState({ likeState: "showRed" });
        likeAllArr.push(likeItem);
        setLikeDb(this.props.userUid, likeAllArr);
      }
    }
  };

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
              if (
                this.props.likeList.find(
                  (i) => i.id === this.props.locationDetail.id
                )
              ) {
                this.setState({ likeState: "showRed" });
              } else {
                this.setState({ likeState: "showGray" });
              }
            }}
            onMouseLeave={() => {
              if (
                this.props.likeList.find(
                  (i) => i.id === this.props.locationDetail.id
                )
              ) {
                return;
              } else {
                this.setState({ likeState: "hide" });
              }
            }}
          >
            <div
              id={`likeSearch-${this.props.locationDetail.id}`}
              className={
                this.state.likeState === "hide"
                  ? styles.hideLike
                  : this.state.likeState === "showRed"
                  ? styles.redLike
                  : styles.grayLike
              }
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
  likeList: PropTypes.array,
  userUid: PropTypes.string,
};

export default FindLocationCard;
