import React, { Fragment, useState, useEffect } from "react";
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
)(() => {
  const [travelDataObj, setTravelDataObj] = useState({});
  const [travelDataArr, setTravelDataArr] = useState([]);
  const [center, setCenter] = useState({});
  // const [centerCountry, setCenterCountry] = useState("");
  console.log(travelDataObj);
  useEffect(() => {
    db.collection("schedule")
      .doc("userId")
      .collection("data")
      .doc(`travel${location.pathname.charAt(location.pathname.length - 1)}`)
      .collection("dateBlockDetail")
      .onSnapshot((docs) => {
        let travelDataTemp = {};
        let travelDataArrTemp = [];
        docs.forEach((doc) => {
          travelDataTemp[doc.data().name] = doc.data().morning;
          travelDataArrTemp.push(doc.data());
        });

        setTravelDataObj(travelDataTemp);
        setTravelDataArr(travelDataArrTemp);

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
          }
        });
      });
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setCenter({
  //       lat: 1,
  //       lng: 103
  //     });
  //   }, 3000);
  // }, []);

  const renderMap = () => {
    console.log("travelDataArr", travelDataArr);
    return (
      <Fragment>
        <GoogleMap center={center} zoom={10}>
          {travelDataArr.map((date) => {
            // console.log("date", date);
            if (date.morning.length !== 0) {
              console.log(date);
              date.morning.map((place) => {
                // console.log(place);

                console.log("place", place.pos);
                return (
                  <Marker
                    // key={place.id}
                    // position={place.pos}
                    key={123}
                    position={{
                      lat: 40,
                      lng: -73,
                    }}

                    // onClick={event =>
                    //   props.markerClickHandler(event, place, Math.floor(i / 3))
                    // }
                  >
                    {
                      <InfoWindow>
                        <div>
                          <h3>{33}</h3>
                        </div>
                      </InfoWindow>
                    }
                  </Marker>
                );
              });
            }
          })}
        </GoogleMap>
      </Fragment>
    );
  };
  return renderMap();
});

export default SimpleMap;
