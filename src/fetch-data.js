import { writeFileSync } from "fs";
import fetch from "node-fetch";
const apiUrl = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&station=PUG1618&product=currents_predictions&time_zone=lst&interval=6&units=english&format=json";
const getApiUrl = (stationId) => {
    return `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=${stationId}&product=currents_predictions&time_zone=lst&interval=6&units=english&format=json`;
};
const stationIds = [`PUG1618`];
const metadataUrl = "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=currentpredictions&units=english";
const getStationData = async () => {
    const response = await fetch(getApiUrl(stationIds[0]));
    const data = await response.json();
    console.log("data: ", data);
};
const getMetadata = async () => {
    const response = await fetch(metadataUrl);
    const data = (await response.json());
    return data;
    // console.log("data.stations.length: ", data.stations.length);
};
const getMetadataCsv = async () => {
    let result = "id,point_latitude,point_longitude,value";
    const stations = (await getMetadata()).stations;
    for (const s of stations) {
        result += `${s.id},${s.lat},${s.lng},1\n`;
    }
    return result;
};
const writeMetadataCsv = async () => {
    const data = await getMetadataCsv();
    writeFileSync("blah.csv", data);
};
// getStationData();
writeMetadataCsv();
