import React from "react";
import {Plot, Line, Text} from "../../src/react/index.js";
import * as d3 from "d3";

export async function driving() {
  const driving = await d3.csv<any>("data/driving.csv", d3.autoType);
  return React.createElement(Plot, {
      inset: 10,
      grid: true,
      x: {
        label: "Miles driven (per person-year)"
      },
      y: {
        label: "Cost of gasoline ($ per gallon)"
      }
    },
    React.createElement(Line, {data: driving, x: "miles", y: "gas", curve: "catmull-rom", markerMid: "arrow"}),
    React.createElement(Text, {data: driving, filter: (d) => d.year % 5 === 0, x: "miles", y: "gas", text: (d) => `${d.year}`, dy: -12})
  );
}
