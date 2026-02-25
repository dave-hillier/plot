import React from "react";
import {Plot, LineY, windowY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function sfTemperatureWindow() {
  const sftemp = await d3.csv<any>("data/sf-temperatures.csv", d3.autoType);
  return React.createElement(Plot, {
      y: {
        grid: true,
        label: "Temperature (\u00b0F)"
      }
    },
    React.createElement(LineY, {data: sftemp, x: "date", y: "low", strokeOpacity: 0.3}),
    React.createElement(LineY, {data: sftemp, ...windowY({k: 28, reduce: "min"}, {x: "date", y: "low", stroke: "blue"})}),
    React.createElement(LineY, {data: sftemp, ...windowY({k: 28, reduce: "max"}, {x: "date", y: "low", stroke: "red"})}),
    React.createElement(LineY, {data: sftemp, ...windowY({k: 28, reduce: "median"}, {x: "date", y: "low"})})
  );
}
