import React from "react";
import {Plot, Density, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function seattlePrecipitationDensity() {
  const data = await d3.csv<any>("data/seattle-weather.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Density, {data, x: "temp_min", y: "wind", weight: "precipitation"}),
    React.createElement(Dot, {data, x: "temp_min", y: "wind", r: "precipitation", fill: "steelblue", fillOpacity: 0.5})
  );
}
