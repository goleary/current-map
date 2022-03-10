import { writeFileSync } from "node:fs";

import axios from "axios";

// @ts-ignore
import GeoJSON from "geojson";

import { MetadataResult } from "./types";

const apiUrl =
  "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&station=PUG1618&product=currents_predictions&time_zone=lst&interval=6&units=english&format=json";

const getApiUrl = (stationId: string): string => {
  return `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=${stationId}&product=currents_predictions&time_zone=lst&interval=6&units=english&format=json`;
};

const stationIds = [`PUG1618`];

const metadataUrl =
  "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=currentpredictions&units=english";

const getStationData = async () => {
  const response = await axios.get(getApiUrl(stationIds[0]));
  console.log("data: ", response.data);
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
  console.log(result);
  return result;
};

const writeMetadata = async () => {
  const csvData = await getMetadataCsv();
  const geojson = await getMetadataGeojson();
  writeFileSync("data/stations.csv", csvData);
  writeFileSync("data/stations_geo.json", JSON.stringify(geojson, null, 2));
};

writeMetadata();
