import React from "react";
import {Plot, RectY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function intradayHistogram() {
  const timestamps = await d3.csv<any>("data/timestamps.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(RectY, {data: timestamps, ...binX({y: "count"}, {x: (d) => d.timestamp.getUTCHours(), interval: 1})})
  );
}
