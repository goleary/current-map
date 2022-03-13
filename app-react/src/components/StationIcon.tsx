import React from "react";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { StationWithPrediction } from "../types";
import "./station-icon.css";

const StationIcon: React.FC<StationWithPrediction & { index: number }> = ({
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
  return (
    <Marker
      position={[lat, lng]}
      icon={L.divIcon({
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        html: `<img src="/arrow.png" style="width: 30px; transform: rotate(${rotation}deg);" />`,
      })}
    ></Marker>
  );
};

export default StationIcon;
