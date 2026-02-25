import React from "react";
import {Plot, RuleY, RuleX, Rect, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function aaplMonthly() {
  const data = await d3.csv<any>("data/aapl.csv", d3.autoType);
  const bin = {x: "Date", y: "Volume", thresholds: 40};
  return React.createElement(Plot, {
      y: {
        transform: (d) => d / 1e6,
        label: "Daily trade volume (millions)",
        round: true
      }
    },
    React.createElement(RuleY, {data: [0]}),
    React.createElement(RuleX, {data, ...binX({y1: "min", y2: "max"}, {...bin, stroke: "#999"})}),
    React.createElement(Rect, {data, ...binX({y1: "p25", y2: "p75"}, {...bin, fill: "#bbb"})}),
    React.createElement(RuleY, {data, ...binX({y: "p50"}, {...bin, strokeWidth: 2})})
  );
}
