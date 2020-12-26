import React, { useState, useEffect } from "react";
import styles from "../scss/schedule.module.scss";
import firebase from "../firebase";
import config from "../config";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  InfoWindow,
  withScriptjs,
  withGoogleMap,
} from "react-google-maps";
import { compose, withProps, lifecycle } from "recompose";
const {
  MarkerWithLabel,
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const db = firebase.firestore();

const SimpleMap = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${config.API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: "100vh", width: "100%" }} />,
    mapElement: <div style={{ height: "100%" }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidUpdate(prevProps) {
      // console.log("trafficDetail", this.props.trafficDetail);
      let locationObj = {};
      let arr = [];
      let state = false;
      if (
        // prevProps.travelDataArr !== this.props.travelDataArr ||
        prevProps.trafficDetail !== this.props.trafficDetail
      ) {
        const DirectionsService = new window.google.maps.DirectionsService();

        Object.keys(this.props.trafficDetail).forEach((item) => {
          // console.log(item);
          let locationArrTemp = [];
          // console.log(this.props.trafficDetail[item]);

          if (this.props.trafficDetail[item].length !== 0) {
            state = true;
            this.props.trafficDetail[item].forEach((route, index) => {
              console.log(123312);
              DirectionsService.route(
                {
                  origin: route.origin,
                  destination: route.destination,
                  travelMode: window.google.maps.TravelMode[route.travelMode],
                },
                (result, status) => {
                  if (status === window.google.maps.DirectionsStatus.OK) {
                    locationArrTemp[index] = result;
                    // location;
                    // console.log("locationArrTemp", locationArrTemp);
                    locationObj[item] = locationArrTemp;
                    this.props.showTraffic(locationObj);
                    // console.log(locationObj);
                    arr.push(result);
                    this.setState({
                      directions: arr,
                    });
                  } else {
                    console.error(`error fetching directions ${result}`);
                  }
                }
              );
            });
          }
        });

        if (state === false) {
          this.props.showTraffic({});
        }
      }
    },
  })
)((props) => {
  const [center, setCenter] = useState({});
  // const [locationSpot, setLocationSpot] = useState({});
  const [colorAll, setColorAll] = useState([]);

  useEffect(() => {
    props.travelDataArr.every((arr) => {
      if (arr.morning.length !== 0) {
        console.log(arr.morning);
        db.collection("indexCountry")
          .doc(arr.morning[0].country)
          .get()
          .then((doc) => {
            let obj = {};
            obj["lat"] = parseFloat(doc.data().latitude);
            obj["lng"] = parseFloat(doc.data().longitude);

            setCenter(obj);
          });
        return;
      } else {
        let centerTemp = {
          lat: 25.049,
          lng: 121.51557,
        };
        setCenter(centerTemp);
      }
    });

    let colorArr = [];
    let n = props.travelDataArr.length;
    let letters = "0123456789ABCDEF".split("");

    for (let j = 0; j < n; j++) {
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      colorArr.push(color);
    }

    setColorAll(colorArr);
  }, [props.travelDataArr]);

  const renderMap = () => {
    // console.log(props.directions);
    return (
      <GoogleMap defaultZoom={11} center={center}>
        {props.travelDataArr.map((date, j) => {
          return date.morning.map((location, i) => {
            return (
              <div key={location.id}>
                <MarkerWithLabel
                  position={location.pos}
                  labelAnchor={new window.google.maps.Point(13, 42)}
                  labelStyle={{
                    backgroundColor: `${colorAll[j]}`,
                    borderRadius: "99em",
                    fontSize: "12px",
                    fontWeight: "bold",
                    width: "25px",
                    height: "25px",
                    textAlign: "center",
                    verticalAlign: "bottom",
                  }}
                  onClick={() => {
                    props.setSelectedPlaceMarker(location);
                    props.setInfoOpen(true);
                  }}
                >
                  <div className={styles.markerText}>{i + 1}</div>
                </MarkerWithLabel>

                <Marker position={location.pos}>
                  {props.infoOpen &&
                    props.selectedPlace.pos.lat == location.pos.lat &&
                    props.selectedPlace.pos.lng == location.pos.lng && (
                      <InfoWindow onCloseClick={() => props.setInfoOpen(false)}>
                        <div>
                          <h3>{props.selectedPlace.name}</h3>
                        </div>
                      </InfoWindow>
                    )}
                </Marker>
              </div>
            );
          });
        })}
        {props.directions &&
          props.directions.map((item, i) => {
            return (
              <DirectionsRenderer
                directions={item}
                key={i}
                defaultOptions={{
                  suppressMarkers: true,
                }}
              />
            );
          })}
      </GoogleMap>
    );
  };
  return renderMap();
});

export default SimpleMap;

// polylineOptions: { strokeColor: "#8b0013" }

// var polylineOptionsActual = {
//   strokeColor: '#FF0000',
//   strokeOpacity: 1.0,
//   strokeWeight: 10
//   };

// console.log("this.props.trafficDetail", this.props.trafficDetail);
// 想辦法判斷 traffic detail 全都是空的，如果全都是空的就把 state 設成 true
// 在底下的 REsult 判斷如果是 true 就不要 ｓｅｔＳＴａｔｅ
