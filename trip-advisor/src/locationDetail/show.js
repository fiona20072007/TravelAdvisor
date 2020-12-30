import React from "react";
import PropTypes from "prop-types";
import styles from "../scss/locationDetail.module.scss";
import {
  setLikeRed,
  setLikeGray,
  showLike,
  hideLike,
  handleStar,
  // scrollIntoView
} from "../Utils";

const Show = (props) => {
  // const [locationDetailCard, setLocationDetailCard] = useState([]);

  return (
    <div
      id={props.item.id}
      onClick={() =>
        props.markerClickHandler(props.item, Math.floor(props.i / 3))
      }
      className={styles.item}
      onMouseOver={() => {
        showLike(props.item.id);
        if (props.likeList.find((i) => i.id === props.item.id)) {
          setLikeRed(props.item.id);
        } else {
          setLikeGray(props.item.id);
        }
      }}
      onMouseLeave={() => {
        if (props.likeList.find((i) => i.id === props.item.id)) {
          return;
        } else {
          hideLike(props.item.id);
        }
      }}
    >
      <img src={props.item.photo} className={styles.itemPhoto}></img>
      <div className={styles.itemCardName}>{props.item.name}</div>

      <div className={styles.ratings}>
        <div className={styles["empty-stars"]}></div>
        <div
          className={styles["full-stars"]}
          style={{ width: handleStar(props.item.star_level) }}
        ></div>
      </div>
      <div
        id={`like-${props.item.id}`}
        className={styles.itemLike}
        onClick={() => this.handleLike(props.item)}
      >
        <svg id="icon-heart" viewBox="0 0 32 32" width="30" height="20">
          <title>heart</title>
          <path d="M29.306 4.768c-1.662-1.66-3.958-2.687-6.493-2.687s-4.831 1.027-6.493 2.687l-0.32 0.32-0.32-0.32c-1.662-1.664-3.96-2.694-6.498-2.694-5.072 0-9.183 4.112-9.183 9.183 0 2.534 1.026 4.828 2.686 6.49l11.363 11.373c0.499 0.496 1.187 0.803 1.947 0.803s1.448-0.307 1.947-0.803l11.353-11.36c1.671-1.66 2.705-3.96 2.705-6.501 0-2.536-1.030-4.832-2.695-6.491l-0-0z"></path>
        </svg>
      </div>
    </div>
  );
};

Show.propTypes = {
  item: PropTypes.object,
  likeList: PropTypes.array,
  i: PropTypes.number,
  markerClickHandler: PropTypes.func,
};

export default Show;
