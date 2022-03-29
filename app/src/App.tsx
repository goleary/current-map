import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import dateFormat from "dateformat";

import { StationWithPrediction } from "./types";
import StationMarker from "./components/StationMarker";
import Controls from "./components/Controls";
import Legend from "./components/Legend";
import Title from "./components/Title";

function App() {
  const [stations, setStations] = useState<StationWithPrediction[]>([]);

  const [sliderValue, setSliderValue] = useState(0);

  const [dates, setDates] = useState<Date[]>([]);

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

      setDates(stationsResult[0].predictions.map(({ Time }) => new Date(Time)));
    };
    fetchStationData();
  }, []);

  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <MapContainer center={[48, -123]} zoom={8} style={{ height: "100%" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution={`&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
            &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`}
        />
        {/* TODO: could memoize this or the stations themselves */}
        {stations.map((s) => (
          <StationMarker key={s.id} {...s} index={sliderValue} />
        ))}
      </MapContainer>
      <Title />
      <Legend />
      <Controls
        dates={dates}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
      />
    </div>
  );
}

export default App;
