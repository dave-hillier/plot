import React from "react";
import {Plot, AreaY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function aaplInterval() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(AreaY, {data: aapl.slice(0, 81), x: "Date", y1: "Low", y2: "High", interval: "day", curve: "step"})
  );
}
