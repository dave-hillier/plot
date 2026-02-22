import React from "react";
import {Plot, Density, Geo} from "../../src/react/index.js";
import * as d3 from "d3";

export async function walmartsDensityUnprojected() {
  const walmarts = await d3.tsv<any>("data/walmarts.tsv", d3.autoType);
  return React.createElement(Plot, {
      width: 960,
      height: 600,
      grid: true,
      color: {
        scheme: "blues"
      }
    },
    React.createElement(Density, {data: walmarts, x: "longitude", y: "latitude", bandwidth: 12, fill: "density"}),
    React.createElement(Geo, {data: {type: "MultiPoint", coordinates: walmarts.map((d) => [d.longitude, d.latitude])}})
  );
}
