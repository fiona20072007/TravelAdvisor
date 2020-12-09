import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import config from "../config";
import {
  GoogleMap,
  Marker,
  // InfoWindow,
  withScriptjs,
  withGoogleMap,
} from "react-google-maps";
import { compose, withProps } from "recompose";

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

  useEffect(() => {
    db.collection("schedule")
      .doc("userId")
      .collection("data")
      .doc(`travel${location.pathname.charAt(location.pathname.length - 1)}`)
      .collection("dateBlockDetail")
      .onSnapshot((docs) => {
        // let travelDataTemp = {};
        let travelDataArrTemp = [];
        docs.forEach((doc) => {
          // travelDataTemp[doc.data().name] = doc.data().morning;
          travelDataArrTemp.push(doc.data());
        });
        console.log("travelDataArrTemp", travelDataArrTemp);

        // setTravelDataObj(travelDataTemp);

        travelDataArrTemp.forEach((arr, i) => {
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
          } else if (i === arr.length - 1) {
            let centerTemp = {
              lat: 25.049,
              lng: 121.51557,
            };
            setCenter(centerTemp);
          } else {
            let centerTemp = {
              lat: 25.049,
              lng: 121.51557,
            };
            setCenter(centerTemp);
          }
        });
      });
  }, []);

  const renderMap = () => {
    let num = 3;
    let color = "ff3300";
    return (
      <GoogleMap defaultZoom={11} center={center}>
        {props.travelDataArr.map((date) => {
          return date.morning.map((location) => {
            return (
              <Marker
                key={location.id}
                position={location.pos}
                options={{
                  icon: `https://mt.google.com/vt/icon/text=${num}&psize=16&font=fonts/arialuni_t.ttf&color=${color}00&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=1`,
                }}
              >
                {/* {props.infoOpen && props.selectedPlace.pos == place.pos && (
                  <InfoWindow onCloseClick={() => props.setInfoOpen(false)}>
                    <div>
                      <h3>{props.selectedPlace.name}</h3>
                    </div>
                  </InfoWindow>
                )} */}
              </Marker>
            );
          });
        })}
      </GoogleMap>
    );
  };
  return renderMap();
});

export default SimpleMap;
