import React from "react";
import {Plot, Density, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function faithfulDensity1d() {
  const faithful = await d3.tsv<any>("data/faithful.tsv", d3.autoType);
  return React.createElement(Plot, {height: 100, inset: 20},
    React.createElement(Density, {data: faithful, x: "waiting", stroke: "steelblue", strokeWidth: 0.25, bandwidth: 10}),
    React.createElement(Density, {data: faithful, x: "waiting", stroke: "steelblue", thresholds: 4, bandwidth: 10}),
    React.createElement(Dot, {data: faithful, x: "waiting", fill: "currentColor", r: 1.5})
  );
}
