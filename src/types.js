// To parse this data:
//
//   import { Convert, Station } from "./file";
//
//   const station = Convert.toStation(json);
// Converts JSON strings to/from your types
export class Convert {
    static toStation(json) {
        return JSON.parse(json);
    }
    static stationToJson(value) {
        return JSON.stringify(value);
    }
}
