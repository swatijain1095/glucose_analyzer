// call function and expect to return corret index
// 01:05 => 6
// 00:00 => 0
// 02:05 => 12

import { expect, describe, it } from "vitest";

import {
  getCurrentTimeRefereceIndex,
  getTimeRefernceArray,
} from "./getPolishedData";

describe("Utility - getPolishedData", () => {
  it("getCurrentTimeRefereceIndex should work as expected", () => {
    const index = getCurrentTimeRefereceIndex(
      getTimeRefernceArray(),
      "01:05:00"
    );
    const index1 = getCurrentTimeRefereceIndex(
      getTimeRefernceArray(),
      "00:00:00"
    );
    const index2 = getCurrentTimeRefereceIndex(
      getTimeRefernceArray(),
      "02:10:00"
    );
    const index3 = getCurrentTimeRefereceIndex(
      getTimeRefernceArray(),
      "23:55:00"
    );
    expect(index).toBe(6);
    expect(index1).toBe(0);
    expect(index2).toBe(13);
    expect(index3).toBe(143);
  });
});
