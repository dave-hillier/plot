import React from "react";
import {Plot, BarX, Text} from "../../src/react/index.js";
import * as d3 from "d3";

export async function firstLadies() {
  const data = await d3.csv<any>("data/first-ladies.csv", d3.autoType);
  const now = new Date("2021-07-19");
  return React.createElement(Plot, {
      width: 960,
      marginRight: 120,
      x: {
        axis: "top"
      },
      y: {
        axis: null
      }
    },
    React.createElement(BarX, {data, x1: "birth", x2: (d) => d.death ?? now, y: "name", fill: "#ccc"}),
    React.createElement(BarX, {data, x1: "tenure_start", x2: (d) => d.tenure_end ?? now, y: "name", sort: {y: "x1", reduce: "min"}}),
    React.createElement(Text, {data, x: (d) => d.death ?? now, y: "name", text: "name", textAnchor: "start", dx: 5})
  );
}
