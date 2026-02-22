import React from "react";
import {Plot, AreaY, Line, windowY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function sfTemperatureBand() {
  const temperatures = await d3.csv<any>("data/sf-temperatures.csv", d3.autoType);
  return React.createElement(Plot, {
      y: {
        grid: true,
        label: "Daily temperature range (\u00b0F)"
      },
      width: 960
    },
    React.createElement(AreaY, {data: temperatures, x: "date", y1: "low", y2: "high", curve: "step", fill: "#ccc"}),
    React.createElement(Line, {data: temperatures, ...windowY({x: "date", y: "low", k: 7, strict: true, curve: "step", stroke: "blue"})}),
    React.createElement(Line, {data: temperatures, ...windowY({x: "date", y: "high", k: 7, strict: true, curve: "step", stroke: "red"})})
  );
}
