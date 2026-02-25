import React from "react";
import {Plot, Geo} from "../../src/react/index.js";
import * as d3 from "d3";

export async function geoLine() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Geo, {data: {type: "LineString", coordinates: aapl.map((d) => [d.Date, d.Close])}})
  );
}
