import React from "react";
import PropTypes from "prop-types";
import styles from "../scss/locationDetail.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapPin,
  faPhone,
  faBusinessTime,
  faCocktail,
} from "@fortawesome/free-solid-svg-icons";
import { handleStar } from "../Utils";

const DetailCard = (props) => {
  return (
    <div id="show" className={styles.itemSelect}>
      <img src={props.place.photo} className={styles.itemSelectPhoto}></img>
      <div className={styles.selectDetail}>
        <div className={styles.itemName}>
          <FontAwesomeIcon icon={faCocktail} />
          {props.place.name}
        </div>
        <div className={styles.ratings}>
          <div className={styles["empty-stars"]}></div>
          <div
            className={styles["full-stars"]}
            style={{ width: handleStar(props.place.star_level) }}
          ></div>
        </div>
        <div>
          <div className={styles.itemTitle}>
            <FontAwesomeIcon icon={faMapPin} />
            地點
          </div>
          <div className={styles.itemComment}>{props.place.address}</div>
        </div>
        <div>
          <div className={styles.itemTitle}>
            <FontAwesomeIcon icon={faPhone} />
            電話
          </div>
          <div className={styles.itemComment}>{props.place.telephone}</div>
        </div>
        <div className={styles.itemOpenTime}>
          <div className={styles.itemTitle}>
            <FontAwesomeIcon icon={faBusinessTime} />
            營業時間
          </div>
          <div className={styles.itemComment}>{props.place.open_time}</div>
        </div>
      </div>
    </div>
  );
};

DetailCard.propTypes = {
  place: PropTypes.object,
};

export default DetailCard;
