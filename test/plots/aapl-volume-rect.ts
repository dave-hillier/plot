import React from "react";
import {Plot, RectY, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function aaplVolumeRect() {
  const AAPL = (await d3.csv<any>("data/aapl.csv", d3.autoType)).slice(-40);
  return React.createElement(Plot, {
      y: {
        grid: true,
        transform: (d) => d / 1e6,
        label: "Daily trade volume (millions)"
      }
    },
    React.createElement(RectY, {data: AAPL, x: "Date", interval: "day", y: "Volume", fill: "#ccc"}),
    React.createElement(RuleY, {data: AAPL, x: "Date", interval: "day", y: "Volume"}),
    React.createElement(RuleY, {data: [0]})
  );
}
