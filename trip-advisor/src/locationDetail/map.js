import React, { Fragment } from "react";
import config from "../config";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  withScriptjs,
  withGoogleMap,
} from "react-google-maps";
import { compose, withProps } from "recompose";

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
  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap center={props.center} zoom={props.zoom}>
          {props.locationDetail.map((place, i) => {
            return (
              <Marker
                key={place.id}
                position={place.pos}
                onClick={() =>
                  props.markerClickHandler(place, Math.floor(i / 3))
                }
              >
                {props.infoOpen && props.selectedPlace.pos == place.pos && (
                  <InfoWindow onCloseClick={() => props.setInfoOpen(false)}>
                    <div>
                      <h3>{props.selectedPlace.name}</h3>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            );
          })}
        </GoogleMap>
      </Fragment>
    );
  };
  return renderMap();
});

export default SimpleMap;
