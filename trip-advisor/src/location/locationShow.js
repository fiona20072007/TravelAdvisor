import React from "react";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";
import styles from "../scss/location.module.scss";

const LocationShow = (props) => {
  return (
    <div className={styles.location}>
      {/* <div className={styles.titleShow}>熱門地點</div> */}
      <div className={styles.locationShow}>
        {props.indexLocation.map((item) => {
          return (
            <div
              key={nanoid()}
              className={styles.item}
              onClick={() => {
                props.handleOnChange({ value: item.name, label: item.name });
              }}
            >
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.itemDescription}>{item.description}</div>
              <img
                src={item.photo}
                alt={item.name}
                className={styles.itemPhoto}
              ></img>
            </div>
          );
        })}
      </div>
    </div>
  );
};

LocationShow.propTypes = {
  indexLocation: PropTypes.array.isRequired,
  handleOnChange: PropTypes.func.isRequired,
};

export default LocationShow;
