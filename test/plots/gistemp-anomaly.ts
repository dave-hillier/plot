import React from "react";
import {Plot, RuleY, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function gistempAnomaly() {
  const data = await d3.csv<any>("data/gistemp.csv", d3.autoType);
  return React.createElement(Plot, {
      y: {label: "Temperature anomaly (\u00b0C)", tickFormat: "+f", grid: true},
      color: {scheme: "BuRd"}
    },
    React.createElement(RuleY, {data: [0]}),
    React.createElement(Dot, {data, x: "Date", y: "Anomaly", stroke: "Anomaly"})
  );
}
