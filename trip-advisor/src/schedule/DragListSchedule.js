import React from "react";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";

const DragListSchedule = (props) => {
  return (
    <div>
      {props.travelDetailCountry[props.item] === undefined && (
        <div className={styles.emptyList}>Drop Here!</div>
      )}
      {props.travelDetailCountry[props.item] &&
        props.travelDetailCountry[props.item].map((item, i) => {
          return (
            <Draggable draggableId={`Id-${item.id}`} index={i} key={item.id}>
              {(provided) => (
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  className={styles.itemList}
                >
                  <img
                    src={item.PointImgUrl}
                    className={styles.itemPhoto}
                  ></img>
                  <div className={styles.itemName}>{item.name}</div>
                  <div>{item.star_level}</div>
                </div>
              )}
            </Draggable>
          );
        })}
    </div>
  );
};

DragListSchedule.propTypes = {
  item: PropTypes.string,
  travelDetailCountry: PropTypes.object,
};

export default DragListSchedule;
