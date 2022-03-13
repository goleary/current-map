// import { writeFileSync } from "node:fs";

import axios from "axios";

import stationMetadata from "./station_metadata.json";

import {
  CurrentPrediction,
  CurrentPredictions,
  MetadataResult,
  Station,
} from "../types";

type StationWithPrediction = Pick<Station, "lat" | "lng" | "name" | "id"> & {
  predictions: CurrentPrediction[];
};

class CurrentApi {
  private client = axios.create({
    baseURL: "https://api.tidesandcurrents.noaa.gov/",
  });
  constructor() {}
  async getMetaData(): Promise<MetadataResult> {
    // const response = await this.client.get("/mdapi/prod/webapi/stations.json", {
    //   params: {
    //     type: "currentpredictions",
    //     units: "english",
    //   },
    // });
    // const metadata = response.data;
    // writeFileSync("station_metadata.json", JSON.stringify(metadata, null, 2));
    return stationMetadata;
  }

  async getStationData(stationId: string, params?: Object) {
    const defaultParams = {
      station: stationId,
      product: "currents_predictions",
      time_zone: "lst",
      interval: 30,
      units: "english",
      format: "json",
    };
    try {
      const response = await this.client.get(`/api/prod/datagetter`, {
        timeout: 30000,
        params: {
          ...defaultParams,
          ...params,
        },
      });
      return response.data;
    } catch (error) {}
  }

  async getStationDataWithPredictions(
    params?: Object
  ): Promise<StationWithPrediction[]> {
    const { stations: rawStations } = await this.getMetaData();

    let total = 0,
      withPrediction = 0;
    const stationsWithPredictions: StationWithPrediction[] = [];

    const promises: Promise<any>[] = [];
    const stations: Station[] = [];
    const stationIdSet = new Set<string>();
    let numStations = 0;
    for (const s of rawStations) {
      if (!s.id.startsWith("P")) {
        // only interested in pacific stations for now.
        continue;
      }
      if (!s.id.startsWith("PUG")) {
        // only interested in non "subordinate" stations for now.
        continue;
      }
      if (stationIdSet.has(s.id)) {
        continue;
      }

      promises.push(this.getStationData(s.id, params));
      stations.push(s);
      stationIdSet.add(s.id);
      numStations++;
      if (numStations > 100) {
        break;
      }
    }
    const results = await Promise.allSettled(promises);
    for (let i = 0; i < results.length; i++) {
      const stationData = stations[i];
      const result = results[i];
      if (result.status === "rejected") {
        console.warn(
          `Failed to fetch prediction data for station: ${stationData.id}`
        );
        continue;
      }
      const predictionData = result.value;

      if (!predictionData?.current_predictions) {
        // station may have been removed or error fetching the data
        console.warn(`No prediction data for station: ${stationData.id}`);
        continue;
      }

      const predictions = (
        predictionData.current_predictions as CurrentPredictions
      ).cp;

      if (predictions instanceof Array) {
        stationsWithPredictions.push({
          name: stationData.name,
          lat: stationData.lat,
          lng: stationData.lng,
          id: stationData.id,
          predictions,
        });
        withPrediction++;
      }
      total++;
    }
    return stationsWithPredictions;
  }
}

const currentApi = new CurrentApi();

export default currentApi;
