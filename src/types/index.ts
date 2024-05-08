import moment from "moment";

export interface GlucoseData {
  value: number;
  timeStamp: moment.Moment;
}

export enum InsulinType {
  Rapid = "RAPID",
  Long = "LONG",
}

export interface InsulinData {
  type: InsulinType;
  value: number;
  timeStamp: moment.Moment;
}

export interface RawCsvDataItem {
  historicGlucoseMmol: number | null;
  scanGlucoseMmol: number | null;
  longActingInsulinValueUnits: number | null;
  rapidActingInsulinUnits: number | null;
  recordType: number | null;
  deviceTimestamp: string;
}
