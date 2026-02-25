import React from "react";
import {Plot, RuleY, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function gistempAnomalyTransform() {
  const data = await d3.csv<any>("data/gistemp.csv", d3.autoType);
  const transform = (c) => (c * 9) / 5; // convert (relative) Celsius to Fahrenheit
  return React.createElement(Plot, {
      y: {label: "Temperature anomaly (\u00b0F)", tickFormat: "+f", transform, grid: true},
      color: {scheme: "BuRd", domain: [-1, 1], transform}
    },
    React.createElement(RuleY, {data: [0]}),
    React.createElement(Dot, {data, x: "Date", y: "Anomaly", stroke: "Anomaly"})
  );
}
