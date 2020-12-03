import React from "react";
import PropTypes from "prop-types";
import styles from "../scss/locationDetail.module.scss";

const Show = (props) => {
  return (
    <div>
      <div className={styles.banner}>
        <div className={styles.bannerName}>{props.locationBanner.name}</div>
        <div className={styles.bannerDes}>
          {props.locationBanner.description}
        </div>
        <img className={styles.bannerPhoto} src={props.locationBanner.photo} />
      </div>
      <div className={styles.location}>
        <div className={styles.titleShow}>搜尋結果</div>
        <div className={styles.locationShow}>{props.locationArray}</div>
      </div>
    </div>
  );
};

Show.propTypes = {
  locationBanner: PropTypes.array,
  locationArray: PropTypes.array,
};

export default Show;
