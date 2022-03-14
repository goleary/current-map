import React from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

import dateFormat from "dateformat";

import { StationWithPrediction } from "../types";
import "./station-icon.css";

const getIconHtml = (rotation: number, fill = "black") => {
  return `
    <div style="transform: rotate(${rotation}deg);">
      <svg fill="${fill}" x="0px" y="0px" viewBox="0 0 490 490">
        <g>
          <path d="M480.086,490L245,339.229L9.914,490L245,0L480.086,490z"/>
        </g>
      </svg>
    </div>
  `;
};

const StationMarker: React.FC<StationWithPrediction & { index: number }> = ({
  name,
  id,
  lat,
  lng,
  predictions,
  index,
}) => {
  const prediction = predictions[index];
  const rotation =
    prediction.Velocity_Major > 0
      ? prediction.meanFloodDir
      : prediction.meanEbbDir;
  const velocity = Math.abs(prediction.Velocity_Major);
  const date = new Date(prediction.Time);
  let color = "black";
  if (velocity > 7) {
    color = "red";
  } else if (velocity > 3) {
    color = "yellow";
  } else if (velocity > 1) {
    color = "green";
  }
  return (
    <Marker
      position={[lat, lng]}
      icon={L.divIcon({
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        html: getIconHtml(rotation, color),
      })}
    >
      <Popup>
        <a
          href={`https://tidesandcurrents.noaa.gov/noaacurrents/Predictions?id=${id}`}
          rel="noreferrer"
          target="_blank"
        >
          {name}
        </a>
        <p>
          Current {velocity} knots at {dateFormat(date, "ddd, mmm dS, h:MM TT")}
        </p>
      </Popup>
    </Marker>
  );
};

export default StationMarker;
