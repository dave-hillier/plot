import React from "react";
import {Plot, Raster, Contour, Frame, identity} from "../../src/react/index.js";
import * as d3 from "d3";

export async function volcano() {
  const volcano = await d3.json<any>("data/volcano.json");
  return React.createElement(Plot, {},
    React.createElement(Raster, {data: volcano.values, width: volcano.width, height: volcano.height}),
    React.createElement(Frame, {})
  );
}

export async function volcanoTerrain() {
  const volcano = await d3.json<any>("data/volcano.json");
  return React.createElement(Plot, {
      color: {
        interpolate: d3.piecewise(d3.interpolateHsl, [
          d3.hsl(120, 1, 0.65 / 2),
          d3.hsl(60, 1, 0.9 / 2),
          d3.hsl(0, 0.4, 0.95)
        ])
      }
    },
    React.createElement(Raster, {data: volcano.values, width: volcano.width, height: volcano.height}),
    React.createElement(Contour, {data: volcano.values, width: volcano.width, height: volcano.height, stroke: "white"}),
    React.createElement(Frame, {})
  );
}

export async function volcanoContour() {
  const volcano = await d3.json<any>("data/volcano.json");
  return React.createElement(Plot, {},
    React.createElement(Contour, {
      data: volcano.values,
      width: volcano.width,
      height: volcano.height,
      fill: identity,
      stroke: "currentColor"
    }),
    React.createElement(Frame, {})
  );
}
