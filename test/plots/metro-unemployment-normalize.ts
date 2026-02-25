import React from "react";
import {Plot, Line, RuleY, normalizeY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function metroUnemploymentNormalize() {
  const data = await d3.csv<any>("data/bls-metro-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {
      y: {
        type: "log",
        label: "Change in unemployment (%)",
        grid: true,
        tickFormat: (x) => `${x.toPrecision(1)}×`
      }
    },
    React.createElement(Line, {data, ...normalizeY({x: "date", y: "unemployment", z: "division"})}),
    React.createElement(RuleY, {data: [1]})
  );
}
