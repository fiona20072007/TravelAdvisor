import React from "react";
import firebase from "../firebase";
import styles from "../scss/schedule.module.scss";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";

const db = firebase.firestore();

class LikeLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationDetail: [],
      locationLikeDetail: [],
    };
  }

  componentDidMount() {
    // let elsLike = document.getElementsByClassName("likeLocationShow");
    // Array.from(elsLike).forEach((el) => {
    //   el.style.display = "none";
    // });

    db.collection("schedule")
      .doc(this.props.userUid)
      .onSnapshot((docAll) => {
        this.setState({
          locationDetail: docAll.data().like,
        });
        let locationLikeDetailTemp = [];
        docAll.data().like.map((item) => {
          db.collection("country")
            .doc(item.country)
            .collection("location")
            .where("id", "==", item.id.toString())
            .get()
            .then((docs) => {
              docs.forEach((doc) => {
                locationLikeDetailTemp.push({
                  name: doc.data().name,
                  country: doc.data().Country,
                  city: doc.data().City,
                  area: doc.data().Area,
                  photo: doc.data().PointImgUrl,
                  pos: {
                    lat: parseFloat(doc.data().latitude, 10),
                    lng: parseFloat(doc.data().longitude, 10),
                  },
                  address: doc.data().address,
                  open_time: doc.data().open_time,
                  telephone: doc.data().telephone,
                  star_level: doc.data().star_level,
                  travelPoint: doc.data().TravelPoint_Be_Added_Count,
                  url: doc.data().url,
                  id: parseInt(doc.data().id),
                });

                this.setState({
                  locationLikeDetail: locationLikeDetailTemp,
                });
              });
            });
        });
      });
  }

  handleLike = (item) => {
    let arr = this.state.locationLikeDetail.filter(
      (like) => like.id !== item.id
    );
    let setArr = this.state.locationDetail.filter(
      (like) => like.id !== item.id
    );
    this.setState({
      locationLikeDetail: arr,
    });
    console.log(setArr);
    db.collection("schedule").doc(this.props.userUid).set(
      {
        like: setArr,
      },
      { merge: true }
    );
  };

  render() {
    return (
      <div className={styles.likeList} id="likeList">
        {this.state.locationLikeDetail.map((item, i) => {
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
                      style={{ width: this.props.handleStar(item.star_level) }}
                    ></div>
                  </div>
                  {/* <div>{item.star_level}</div> */}
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
  handleStar: PropTypes.func,
};

export default LikeLocation;
