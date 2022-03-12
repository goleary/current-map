import { writeFileSync } from "node:fs";

import axios from "axios";

// @ts-ignore
import GeoJSON from "geojson";

import {
  Convert,
  CurrentPrediction,
  CurrentPredictions,
  MetadataResult,
  Station,
} from "../server/src/types";

type StationWithPrediction = Pick<Station, "lat" | "lng" | "name" | "id"> & {
  prediction: CurrentPrediction;
};

const apiUrl =
  "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&station=PUG1618&product=currents_predictions&time_zone=lst&interval=6&units=english&format=json";

const getApiUrl = (stationId: string): string => {
  return `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=${stationId}&product=currents_predictions&time_zone=lst&interval=6&units=english&format=json`;
};

const stationIds = ["PUG1627", "PUG1701", "CAB1401", "ACT0091", `PUG1618`];

const metadataUrl =
  "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=currentpredictions&units=english";

const getStationData = async () => {
  const response = await axios.get(getApiUrl(stationIds[0]));
  writeFileSync(
    "data/current_predictions.json",
    JSON.stringify(response.data, null, 2)
  );
};

const getMetadata = async (): Promise<MetadataResult> => {
  const response = await axios.get(metadataUrl);

  return response.data;
  // console.log("data.stations.length: ", data.stations.length);
};

const getMetadataCsv = async () => {
  let result = "id,point_latitude,point_longitude,value\n";
  const stations = (await getMetadata()).stations;
  for (const s of stations) {
    result += `${s.id},${s.lat},${s.lng},1\n`;
  }
  return result;
};

const getMetadataGeojson = async () => {
  const stations = (await getMetadata()).stations;
  const result = GeoJSON.parse(stations, { Point: ["lat", "lng"] });
  return result;
};

const writeMetadata = async () => {
  const csvData = await getMetadataCsv();
  const geojson = await getMetadataGeojson();
  writeFileSync("data/stations.csv", csvData);
  writeFileSync("data/stations_geo.json", JSON.stringify(geojson, null, 2));
};

const doStuff = async () => {
  const { stations } = await getMetadata();
  let total = 0,
    withPrediction = 0;
  const stationsWithPrediction: StationWithPrediction[] = [];
  for (const s of stations) {
    if (!s.id.startsWith("P")) {
      // only interested in pacific stations for now.
      continue;
    }
    if (!s.id.startsWith("PUG")) {
      // only interested innon "subordinate" stations for now.
      continue;
    }

    const response = await axios.get(getApiUrl(s.id));

    if (!response.data.current_predictions) {
      // station may have been removed
      continue;
    }

    console.log(`station ${s.id} data: `, response.data);
    const prediction = (response.data.current_predictions as CurrentPredictions)
      .cp[0];

    if (prediction) {
      stationsWithPrediction.push({
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        id: s.id,
        prediction,
      });
      withPrediction++;
    }
    total++;

    console.log(`${withPrediction} stations with prediction out of ${total}`);
  }
  const geojson = GeoJSON.parse(stationsWithPrediction, {
    Point: ["lat", "lng"],
  });
  writeFileSync(
    "data/stations_with_prediction.json",
    JSON.stringify(geojson, null, 2)
  );
};

doStuff();
// writeMetadata();
// getStationData();
