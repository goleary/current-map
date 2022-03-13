import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import dateFormat from "dateformat";

import { StationWithPrediction } from "./types";
import StationIcon from "./components/StationIcon";

function App() {
  const [stations, setStations] = useState<StationWithPrediction[]>([]);

  const sliderMin = 0;
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderMax, setSliderMax] = useState(0);

  useEffect(() => {
    const fetchStationData = async () => {
      const now = new Date();
      const threeDaysInTheFuture = new Date(
        now.getTime() + 3 * 24 * 60 * 60 * 1000
      );
      const mask = "yyyymmdd";
      const params = new URLSearchParams({
        begin_date: dateFormat(now, mask),
        end_date: dateFormat(threeDaysInTheFuture, mask),
        interval: "30",
      });
      const response = await fetch(
        "https://omniscient-society-production.up.railway.app/predictions?" +
          params.toString(),
        {}
      );
      const stationsResult = (await response.json()) as StationWithPrediction[];
      setStations(stationsResult);
      setSliderMax(stationsResult[0].predictions.length);
    };
    fetchStationData();
  }, []);

  const stationsContent = stations.map((s) => (
    <StationIcon key={s.id} {...s} index={sliderValue} />
  ));

  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <input
        type="range"
        min={sliderMin}
        max={sliderMax}
        value={sliderValue}
        onChange={(event) => setSliderValue(parseInt(event.target.value, 10))}
      />
      {sliderValue}
      <MapContainer center={[48, -123]} zoom={8} style={{ height: "100%" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution={`&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
            &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`}
        />
        {stationsContent}
      </MapContainer>
    </div>
  );
}

export default App;
