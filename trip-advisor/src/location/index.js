import React from "react";
import firebase from "../firebase";
import AsyncSelect from "react-select/async";
// import LocationShow from "./locationShow";
import styles from "../scss/location.module.scss";
import PropTypes from "prop-types";

const db = firebase.firestore();

class LocationIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTag: [],
      indexLocation: [],
      // memberLoginState: false
    };
    this.options = [
      {
        value: "台北",
        label: "台北",
        description:
          "充滿現代氛圍的台灣首都。景點包含知名夜市和國立故宮博物院。",
      },
      {
        value: "巴黎",
        label: "巴黎",
        description:
          "法國首都。艾菲爾鐵塔、羅浮宮、聖母院、露天咖啡店和高級時尚的所在地。",
      },
      {
        value: "慕尼黑",
        label: "慕尼黑",
        description:
          "德國巴伐利亞邦的首府。以十月節、皇家啤酒屋和慕尼黑王宮與博物館聞名。",
      },
      {
        value: "新加坡",
        label: "新加坡",
        description: "以巴東、佛牙寺龍華院和烏節路購物中心聞名的國際金融中心。",
      },
      {
        value: "東京",
        label: "東京",
        description: "摩天大樓、博物館、皇居和明治神宮所在的日本首都。",
      },
      { value: "紐約", label: "紐約" },
    ];
  }
  componentDidMount = () => {
    // console.log(window.location.pathname);
    if (window.location.pathname === "/") {
      document.querySelectorAll("svg").forEach((item) => {
        item.style.color = "white";
      });
      document.querySelectorAll("a").forEach((item) => {
        item.style.color = "white";
      });
      document.querySelector("nav").style.backgroundColor = "transparent";
      document.querySelector("nav").style.boxShadow = "0 0 0";
    }
    db.collection("indexCountry").onSnapshot((querySnapshot) => {
      let indexLocationTemp = [];
      querySnapshot.forEach(function (doc) {
        indexLocationTemp.push({
          name: doc.data().name,
          description: doc.data().description,
          photo: doc.data().photo,
        });
      });
      this.setState({
        indexLocation: indexLocationTemp,
      });
    });

    let $cont = document.querySelector(`.${styles.cont}`);
    let $elsArr = [].slice.call(document.querySelectorAll(`.${styles.el}`));
    let $closeBtnsArr = [].slice.call(
      document.querySelectorAll(`.${styles["el__close-btn"]}`)
    );

    setTimeout(() => {
      $cont.classList.remove(styles["s--inactive"]);
    }, 500);

    $elsArr.forEach(function ($el) {
      // console.log(document.querySelectorAll(`.${styles.el}`));
      $el.addEventListener("click", function () {
        if (this.classList.contains(`.${styles["s--active"]}`)) return;
        $cont.classList.add(styles["s--el-active"]);
        this.classList.add(styles["s--active"]);
      });
    });

    $closeBtnsArr.forEach(function ($btn) {
      $btn.addEventListener("click", function (e) {
        console.log(123);
        e.stopPropagation();
        $cont.classList.remove(styles["s--el-active"]);
        document
          .querySelector(`.${styles["s--active"]}`)
          .classList.remove(styles["s--active"]);
      });
    });
  };

  loadOptions = async (inputValue) => {
    // inputValue = inputValue.toLowerCase().replace(/\W/g, "");
    return new Promise((resolve) => {
      db.collection("indexCountry")
        .orderBy("name")
        .startAt(inputValue)
        .endAt(inputValue + "\uf8ff")
        .get()
        .then((docs) => {
          if (!docs.empty) {
            let recommendedTags = [];
            docs.forEach(function (doc) {
              const tag = {
                value: doc.id,
                label: doc.data().name,
              };
              recommendedTags.push(tag);
            });
            return resolve(recommendedTags);
          } else {
            return resolve([]);
          }
        });
    });
  };

  handleOnChange = (tags) => {
    this.props.history.push(`/locationDetail/${tags.label}`);
  };

  render() {
    console.log(this.state.indexLocation);
    let arr = [];
    for (let i = 0; i < 5; i++) {
      let item = (
        <div className={styles.el} key={i}>
          <div className={styles.el__overflow}>
            <div className={styles.el__inner}>
              <div className={styles.el__bg}></div>
              <div className={styles["el__preview-cont"]}>
                <h2 className={styles.el__heading}>{this.options[i].value}</h2>
              </div>
              <div className={styles.el__content}>
                <div className={styles.el__text}>
                  {this.options[i].description}
                </div>
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
    return (
      <div className={`${styles.cont} ${styles["s--inactive"]}`}>
        <div className={styles.content}>
          <div className={styles.content__container}>
            <p className={styles.content__container__text}>Hello</p>

            <ul className={styles.content__container__list}>
              <li className={styles.content__container__list__item}>
                Taipei !
              </li>
              <li className={styles.content__container__list__item}>Paris !</li>
              <li className={styles.content__container__list__item}>
                Munich !
              </li>
              <li className={styles.content__container__list__item}>
                Singapore !
              </li>
              {/* <li className={styles.content__container__list__item}>Tokyo !</li>
            <li className={styles.content__container__list__item}>
              NewYork !
            </li> */}
            </ul>
          </div>
        </div>

        <AsyncSelect
          className={styles.locationInput}
          loadOptions={this.loadOptions}
          onChange={this.handleOnChange}
          defaultOptions={this.options}
          placeholder={<div>輸入想去的首都 &nbsp;&nbsp; ex.台北</div>}
        />

        <div className={styles.cont__inner}>{arr}</div>
      </div>
    );
  }
}

LocationIndex.propTypes = {
  history: PropTypes.object.isRequired,
};

export default LocationIndex;