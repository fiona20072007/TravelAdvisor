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
      let locationObj = {};
      let arr = [];
      let state = false;
      if (prevProps.trafficDetail !== this.props.trafficDetail) {
        const DirectionsService = new window.google.maps.DirectionsService();

        Object.keys(this.props.trafficDetail).forEach((item) => {
          let locationArrTemp = [];

          if (this.props.trafficDetail[item].length !== 0) {
            state = true;
            this.props.trafficDetail[item].forEach((route, index) => {
              DirectionsService.route(
                {
                  origin: route.origin,
                  destination: route.destination,
                  travelMode: window.google.maps.TravelMode[route.travelMode],
                },
                (result, status) => {
                  if (status === window.google.maps.DirectionsStatus.OK) {
                    locationArrTemp[index] = result;

                    locationObj[item] = locationArrTemp;
                    this.props.showTraffic(locationObj);

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
  const [colorAll, setColorAll] = useState([]);

  useEffect(() => {
    const findCenter = Object.keys(props.travelDetailCountry).some((date) => {
      if (props.travelDetailCountry[date].length !== 0) {
        db.collection("indexCountry")
          .doc(props.travelDetailCountry[date][0].country)
          .get()
          .then((doc) => {
            let obj = {};
            obj["lat"] = parseFloat(doc.data().latitude);
            obj["lng"] = parseFloat(doc.data().longitude);

            setCenter(obj);
          });
        return true;
      } else {
        return false;
      }
    });
    if (!findCenter) {
      let centerTemp = {
        lat: 25.049,
        lng: 121.51557,
      };
      setCenter(centerTemp);
    }

    let colorArr = [];
    let n = Object.keys(props.travelDetailCountry).length;

    for (let i = 0; i < n; i++) {
      let cssHSL =
        "hsl(" +
        360 * Math.random() +
        "," +
        (25 + 70 * Math.random()) +
        "%," +
        (80 + 15 * Math.random()) +
        "%)";
      colorArr.push(cssHSL);
    }

    setColorAll(colorArr);
  }, [props.travelDetailCountry]);

  const renderMap = () => {
    return (
      <GoogleMap defaultZoom={11} center={center}>
        {Object.keys(props.travelDetailCountry).map((date, j) => {
          return props.travelDetailCountry[date].map((location, i) => {
            return (
              <div key={location.id}>
                <MarkerWithLabel
                  position={location.pos}
                  labelAnchor={new window.google.maps.Point(13, 42)}
                  labelStyle={{
                    backgroundColor: `${colorAll[j]}`,
                    borderRadius: "99em",
                    border: "2px dotted black",
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
