import { RawCsvDataItem } from "../types";

export const getSortedData = (data: RawCsvDataItem[]) => {
  let sortedData = [];
  sortedData = data.sort(function (x, y) {
    const dateA = new Date(
      parseInt(x.deviceTimestamp.substring(6, 10)), // Year
      parseInt(x.deviceTimestamp.substring(3, 5)), // Month (subtracting 1 for zero-based index)
      parseInt(x.deviceTimestamp.substring(0, 2)), // Day
      parseInt(x.deviceTimestamp.substring(11, 13)), // Hour
      parseInt(x.deviceTimestamp.substring(14, 16)) // Minute
    );

    const dateB = new Date(
      parseInt(y.deviceTimestamp.substring(6, 10)), // Year
      parseInt(y.deviceTimestamp.substring(3, 5)), // Month (subtracting 1 for zero-based index)
      parseInt(y.deviceTimestamp.substring(0, 2)), // Day
      parseInt(y.deviceTimestamp.substring(11, 13)), // Hour
      parseInt(y.deviceTimestamp.substring(14, 16)) // Minute
    );
    return dateA.getTime() - dateB.getTime(); // Using getTime() to compare dates as numbers
  });
  return sortedData;
};
