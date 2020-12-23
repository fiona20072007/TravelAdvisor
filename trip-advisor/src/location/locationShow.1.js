import React from "react";
import PropTypes from "prop-types";
// import { nanoid } from "nanoid";
import styles from "../scss/location.module.scss";
// import $ from "jquery";

class LocationShow extends React.Component {
  componentDidMount() {
    let $cont = document.querySelector(`.${styles.cont}`);
    let $elsArr = [].slice.call(document.querySelectorAll(`.${styles.el}`));
    let $closeBtnsArr = [].slice.call(
      document.querySelectorAll(`.${styles[".el__close-btn"]}`)
    );

    setTimeout(() => {
      console.log(123123);
      $cont.classList.remove(`.${styles["s--inactive"]}`);
    }, 200);

    // console.log(document.querySelectorAll(`.${styles.el}`));

    $elsArr.forEach(function ($el) {
      // console.log(document.querySelectorAll(`.${styles.el}`));
      $el.addEventListener("click", function () {
        // console.log(12345);
        if (this.classList.contains(`.${styles["s--active"]}`)) return;
        $cont.classList.add(`.${styles["s--el-active"]}`);
        this.classList.add(`.${styles["s--active"]}`);
      });
    });

    $closeBtnsArr.forEach(function ($btn) {
      $btn.addEventListener("click", function (e) {
        console.log(123);
        e.stopPropagation();
        $cont.classList.remove(`.${styles["s--el-active"]}`);
        document
          .querySelector(`.${styles[".el.s--active"]}`)
          .classList.remove(`.${styles["s--active"]}`);
      });
    });
  }
  render() {
    let arr = [];
    for (let i = 0; i < 6; i++) {
      let item = (
        <div className={styles.el} key={i}>
          <div className={styles.el__overflow}>
            <div className={styles.el__inner}>
              <div className={styles.el__bg}></div>
              <div className={styles["el__preview-cont"]}>
                <h2 className={styles.el__heading}>Section {i + 1}</h2>
              </div>
              <div className={styles.el__content}>
                <div className={styles.el__text}>HI</div>
                <div className={styles["el__close-btn"]}></div>
              </div>
            </div>
          </div>
          <div className={styles.el__index}>
            <div className={styles["el__index-back"]}>{i + 1}</div>
            <div className={styles["el__index-front"]}>
              <div className={styles["el__index-overlay"]} data-index={i + 1}>
                {i + 1}
              </div>
            </div>
          </div>
        </div>
      );
      arr.push(item);
    }
    // console.log(arr);
    return (
      // <div className={styles.location}></div>
      <div className={`${styles.cont} ${styles["s--inactive"]}`}>
        {/* <div className={styles.titleShow}>熱門地點</div> */}
        {/* <div className={styles.locationShow}> */}
        <div className={styles.cont__inner}>
          {}
          {/* {this.props.indexLocation.map((item, i) => {
            return (
              // <div
              //   key={nanoid()}
              //   className={styles.item}
              //   onClick={() => {
              //     props.handleOnChange({ value: item.name, label: item.name });
              //   }}
              // >
              //   <div className={styles.itemName}>{item.name}</div>
              //   <div className={styles.itemDescription}>{item.description}</div>
              //   <img
              //     src={item.photo}
              //     alt={item.name}
              //     className={styles.itemPhoto}
              //   ></img>
              // </div>

              // <!-- el start -->
              <div className={styles.el} key={i}>
                <div className={styles.el__overflow}>
                  <div className={styles.el__inner}>
                    <div className={styles.el__bg}></div>
                    <div className={styles["el__preview-cont"]}>
                      <h2 className={styles.el__heading}>Section {i + 1}</h2>
                    </div>
                    <div className={styles.el__content}>
                      <div className={styles.el__text}>HI</div>
                      <div className={styles["el__close-btn"]}></div>
                    </div>
                  </div>
                </div>
                <div className={styles.el__index}>
                  <div className={styles["el__index-back"]}>{i + 1}</div>
                  <div className={styles["el__index-front"]}>
                    <div
                      className={styles["el__index-overlay"]}
                      data-index={i + 1}
                    >
                      {i + 1}
                    </div>
                  </div>
                </div>
              </div>
              // <!-- el end -->
            );
          })} */}
          {arr}
        </div>
      </div>
    );
  }
}

LocationShow.propTypes = {
  indexLocation: PropTypes.array.isRequired,
  handleOnChange: PropTypes.func.isRequired,
};

export default LocationShow;
