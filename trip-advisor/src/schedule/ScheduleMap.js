import React, { useState, useEffect } from "react";
import styles from "../scss/schedule.module.scss";
import firebase from "../firebase";
import config from "../config";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  withScriptjs,
  withGoogleMap,
} from "react-google-maps";
import { compose, withProps } from "recompose";
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
  withGoogleMap
)((props) => {
  const [center, setCenter] = useState({});
  const [colorAll, setColorAll] = useState([]);

  useEffect(() => {
    props.travelDataArr.forEach((arr) => {
      if (arr.morning.length !== 0) {
        db.collection("indexCountry")
          .doc(arr.morning[0].country)
          .get()
          .then((doc) => {
            let obj = {};
            obj["lat"] = parseFloat(doc.data().latitude);
            obj["lng"] = parseFloat(doc.data().longitude);

            setCenter(obj);

            return;
          });
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
                    console.log("HIHIHI", location.pos);
                    props.setInfoOpen(true);
                    props.setSelectedPlace(location);
                    console.log("location.pos", location.pos);
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
      </GoogleMap>
    );
  };
  return renderMap();
});

export default SimpleMap;
