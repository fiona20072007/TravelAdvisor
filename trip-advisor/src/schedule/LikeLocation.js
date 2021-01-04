import React from "react";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";
import { handleStar, likeList, setLikeDb } from "../Utils";

class LikeLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationDetail: [],
    };
  }

  componentDidMount() {
    likeList(this.props.userUid).onSnapshot((docAll) => {
      if (docAll.data().like.length !== 0) {
        this.setState({
          locationDetail: docAll.data().like,
        });
      } else {
        this.setState({
          locationDetail: [],
        });
      }
    });
  }

  handleLike = (item) => {
    let setArr = this.state.locationDetail.filter(
      (like) => like.id !== item.id
    );
    setLikeDb(this.props.userUid, setArr);
  };

  render() {
    return (
      <div
        className={
          this.props.showLocationSearch ? styles.likeListShow : styles.likeList
        }
      >
        {this.state.locationDetail.map((item, i) => {
          return (
            <Draggable draggableId={`Ld-${item.id}`} index={i} key={i}>
              {(provided) => (
                <div
                  id={item.id * 10}
                  className={styles.item}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  <div
                    id={`like-${item.id}`}
                    className={styles.itemLike}
                    onClick={() => this.handleLike(item)}
                  >
                    <svg
                      id="icon-heart"
                      viewBox="0 0 32 32"
                      width="30"
                      height="20"
                    >
                      <title>heart</title>
                      <path d="M29.306 4.768c-1.662-1.66-3.958-2.687-6.493-2.687s-4.831 1.027-6.493 2.687l-0.32 0.32-0.32-0.32c-1.662-1.664-3.96-2.694-6.498-2.694-5.072 0-9.183 4.112-9.183 9.183 0 2.534 1.026 4.828 2.686 6.49l11.363 11.373c0.499 0.496 1.187 0.803 1.947 0.803s1.448-0.307 1.947-0.803l11.353-11.36c1.671-1.66 2.705-3.96 2.705-6.501 0-2.536-1.030-4.832-2.695-6.491l-0-0z"></path>
                    </svg>
                  </div>
                  <img src={item.photo} className={styles.itemPhoto}></img>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.ratings}>
                    <div className={styles["empty-stars"]}></div>
                    <div
                      className={styles["full-stars"]}
                      style={{ width: handleStar(item.star_level) }}
                    ></div>
                  </div>
                </div>
              )}
            </Draggable>
          );
        })}
      </div>
    );
  }
}

LikeLocation.propTypes = {
  userUid: PropTypes.string,
  showLocationSearch: PropTypes.bool,
};

export default LikeLocation;
