export interface CurrentPrediction {
  meanFloodDir: number;
  Bin: string;
  meanEbbDir: number;
  Time: string;
  Depth: string;
  Velocity_Major: number;
}

export type StationWithPrediction = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  predictions: CurrentPrediction[];
};
