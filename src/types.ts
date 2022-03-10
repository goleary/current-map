// generated/obtained from quicktype.io
export interface MetadataResult {
  count: number;
  units: string;
  stations: Station[];
}

export interface Station {
  currentpredictionoffsets: Currentpredictionoffsets;
  currbin: number;
  type: string;
  depth: null;
  depthType: string;
  timezone_offset: string;
  harmonicConstituents: Currentpredictionoffsets;
  id: string;
  name: string;
  lat: number;
  lng: number;
  affiliations: string;
  portscode: string;
  products: null;
  disclaimers: null;
  notices: null;
  self: string;
  expand: string;
  tideType: string;
}

export interface Currentpredictionoffsets {
  self: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toStation(json: string): MetadataResult {
    return JSON.parse(json);
  }

  public static stationToJson(value: MetadataResult): string {
    return JSON.stringify(value);
  }

  public static toCurrentPredictions(json: string): CurrentPredictionsResult {
    return JSON.parse(json);
  }
}

export interface CurrentPredictionsResult {
  current_predictions: CurrentPredictions;
}

export interface CurrentPredictions {
  units: string;
  cp: CurrentPrediction[];
}

export interface CurrentPrediction {
  meanFloodDir: number;
  Bin: string;
  meanEbbDir: number;
  Time: string;
  Depth: string;
  Velocity_Major: number;
}
