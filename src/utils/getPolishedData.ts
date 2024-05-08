import {
  GlucoseData,
  InsulinData,
  InsulinType,
  MainData,
  RawCsvDataItem,
} from "../types";
import { getSortedData } from "./getSortedData";
import moment from "moment";

const generateTime = (hour: number, minute: number) => {
  const getFormattedTime = (t: number) => {
    return t.toString().padStart(2, "0");
  };
  return `${getFormattedTime(hour)}:${getFormattedTime(minute)}:00`;
};

export const getTimeRefernceArray = () => {
  const timeRefenceArray = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      timeRefenceArray.push(generateTime(hour, minute));
    }
  }
  return timeRefenceArray;
};

export const getCurrentTimeRefereceIndex = (
  timeReferenceArray: string[],
  formatTimeStamp: string
): number => {
  const index = timeReferenceArray.findIndex((time) => {
    return time > formatTimeStamp;
  });
  if (index === -1) {
    return timeReferenceArray.length - 1;
  }
  if (index === 0) {
    return index;
  }
  return index - 1;
};

const getFormattedGlucoseData = (
  timeStamp: moment.Moment,
  timeStampCount: number,
  timeRefenceArray: string[],
  sum: number,
  count: number
): GlucoseData => {
  const avg = sum / count;
  const formattedTimeStamp = moment(
    timeStamp.format("DD-MM-YYYY") + timeRefenceArray[timeStampCount],
    "DD-MM-YYYY HH:mm:ss"
  );
  return {
    value: avg,
    timeStamp: formattedTimeStamp,
  };
};

export const getPolishedData = (data: RawCsvDataItem[]): MainData => {
  const glucoseData: GlucoseData[] = [];
  const insulinData: InsulinData[] = [];
  const timeRefenceArray = getTimeRefernceArray();
  const sortedData = getSortedData(data);
  let currentDate = sortedData[0].deviceTimestamp.substring(0, 2);
  let fullCurrentDate = sortedData[0].deviceTimestamp;
  let timeStampCount = 0;
  let sum = 0;
  let count = 0;
  sortedData.forEach(
    (
      {
        recordType,
        deviceTimestamp,
        scanGlucoseMmol,
        historicGlucoseMmol,
        rapidActingInsulinUnits,
        longActingInsulinValueUnits,
      },
      index
    ) => {
      const timeStamp = moment(deviceTimestamp, "DD-MM-YYYY HH:mm");
      const formatTimeStamp = timeStamp.format("HH:mm:ss");

      if (recordType === 0 || recordType === 1) {
        // if date is changed
        if (currentDate !== deviceTimestamp.substring(0, 2)) {
          // push all the old data first
          count !== 0 &&
            glucoseData.push(
              getFormattedGlucoseData(
                moment(fullCurrentDate, "DD-MM-YYYY HH:mm"),
                timeStampCount,
                timeRefenceArray,
                sum,
                count
              )
            );
          // reset the counters
          sum = 0;
          count = 0;

          // set the values to this current date's value
          currentDate = deviceTimestamp.substring(0, 2);
          fullCurrentDate = deviceTimestamp;
          // getCurrentTimeStamp and set that index to current timeStampCount
          timeStampCount = getCurrentTimeRefereceIndex(
            timeRefenceArray,
            formatTimeStamp
          );
        } else {
          // if current value is not in current time reference
          if (
            !moment(
              "01-01-2001 " + formatTimeStamp,
              "DD-MM-YYYY HH:mm:ss"
            ).isBetween(
              "01-01-2001 " + timeRefenceArray[timeStampCount],
              "01-01-2001 " + timeRefenceArray[timeStampCount + 1]
            )
          ) {
            // first push the remaining data in the accumulators
            count !== 0 &&
              glucoseData.push(
                getFormattedGlucoseData(
                  timeStamp,
                  timeStampCount,
                  timeRefenceArray,
                  sum,
                  count
                )
              );

            // reset the acc
            sum = 0;
            count = 0;
            timeStampCount = getCurrentTimeRefereceIndex(
              timeRefenceArray,
              formatTimeStamp
            );
          }
        }
        // all values should go in sum and count independent of date or timeframe
        // we add these value to glucoseData in next iteration when we encounter a date or time change event
        if (scanGlucoseMmol !== null) {
          sum += scanGlucoseMmol;
          count++;
        }
        if (historicGlucoseMmol !== null) {
          sum += historicGlucoseMmol;
          count++;
        }
        if (index === sortedData.length - 1 && count !== 0) {
          glucoseData.push(
            getFormattedGlucoseData(
              timeStamp,
              timeStampCount,
              timeRefenceArray,
              sum,
              count
            )
          );
        }
      }

      if (recordType === 4) {
        if (rapidActingInsulinUnits !== null) {
          insulinData.push({
            type: InsulinType.Rapid,
            value: rapidActingInsulinUnits,
            timeStamp,
          });
        }
        if (longActingInsulinValueUnits !== null) {
          insulinData.push({
            type: InsulinType.Long,
            value: longActingInsulinValueUnits,
            timeStamp,
          });
        }
      }
    }
  );

  console.log({ glucoseData, insulinData });
  return {
    glucoseData,
    insulinData,
  };
};
