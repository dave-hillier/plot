import React from "react";
import {Plot, RectY, binX} from "../../src/react/index.js";

export async function binTimestamps() {
  const timestamps = Float64Array.of(
    1609459200000,
    1609545600000,
    1609632000000,
    1609718400000,
    1609804800000,
    1609891200000,
    1609977600000
  );
  return React.createElement(Plot, {},
    React.createElement(RectY, {data: timestamps, ...binX({y: "count"}, {interval: "day"})})
  );
}
