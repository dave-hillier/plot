import React from "react";
import {Plot, Density, Dot, Frame} from "../../src/react/index.js";
import * as d3 from "d3";

export async function faithfulDensity() {
  const faithful = await d3.tsv<any>("data/faithful.tsv", d3.autoType);
  return React.createElement(Plot, {inset: 20},
    React.createElement(Density, {data: faithful, x: "waiting", y: "eruptions", stroke: "steelblue", strokeWidth: 0.25}),
    React.createElement(Density, {data: faithful, x: "waiting", y: "eruptions", stroke: "steelblue", thresholds: 4}),
    React.createElement(Dot, {data: faithful, x: "waiting", y: "eruptions", fill: "currentColor", r: 1.5})
  );
}

export async function faithfulDensityFill() {
  const faithful = await d3.tsv<any>("data/faithful.tsv", d3.autoType);
  return React.createElement(Plot, {inset: 30},
    React.createElement(Frame, {fill: 0}),
    React.createElement(Density, {data: faithful, x: "waiting", y: "eruptions", fill: "density"})
  );
}
