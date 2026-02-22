import React from "react";
import {Plot, Raster, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

// Test for floating point precision issue in interpolateBarycentric.
export async function rasterPrecision() {
  const data = d3.range(4).map((i) => {
    const x = i % 2;
    const y = Math.floor(i / 2);
    return [49.4 + 100 * (x + y), 150.4 + 100 * (x - y)];
  });
  return React.createElement(Plot, {
      x: {type: "identity"},
      y: {type: "identity"},
      color: {scheme: "Sinebow"}
    },
    React.createElement(Raster, {data, fill: (d, i) => i, interpolate: "barycentric"}),
    React.createElement(Dot, {data, fill: (d, i) => i, stroke: "white"})
  );
}

export async function rasterFacet() {
  const points = d3.range(0, 2 * Math.PI, Math.PI / 10).map((d) => [Math.cos(d), Math.sin(d)]);
  return React.createElement(Plot, {
      aspectRatio: 1,
      inset: 100,
      color: {scheme: "Sinebow"}
    },
    React.createElement(Raster, {data: points, fill: "0", fx: (d, i) => i % 2, interpolate: "barycentric"}),
    React.createElement(Dot, {data: points, fx: (d, i) => i % 2, fill: "0", stroke: "white"})
  );
}
