import React from "react";
import PropTypes from "prop-types";
// import { nanoid } from "nanoid";
import styles from "../scss/locationDetail.module.scss";

const Show = (props) => {
  return (
    <div className={styles.location}>
      <div className={styles.titleShow}>搜尋結果</div>
      <div className={styles.locationShow}>
        {props.locationDetail.map((item) => {
          if (props.selectedPlace.id === item.id) {
            return (
              <div
                key={item.id}
                id={item.id}
                onClick={(event) => props.markerClickHandler(event, item)}
                className={styles.itemSelect}
              >
                <img src={item.photo} className={styles.itemSelectPhoto}></img>
                <div className={styles.selectDetail}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div>{item.address}</div>
                  <div>{item.telephone}</div>
                  <div>{item.star_level}</div>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={item.id}
                id={item.id}
                onClick={(event) => props.markerClickHandler(event, item)}
                className={styles.item}
              >
                <img src={item.photo} className={styles.itemPhoto}></img>
                <div className={styles.itemName}>{item.name}</div>
                <div>{item.star_level}</div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

Show.propTypes = {
  locationDetail: PropTypes.array.isRequired,
  markerClickHandler: PropTypes.func.isRequired,
  selectedPlace: PropTypes.object.isRequired,
};

export default Show;
