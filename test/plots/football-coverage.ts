import React from "react";
import {Plot, Frame, Dot, stackX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function footballCoverage() {
  const football = await d3.csv<any>("data/football-coverage.csv", d3.autoType);
  return React.createElement(Plot, {
      x: {axis: null},
      y: {grid: true, domain: [0, 0.5], tickFormat: "%"},
      facet: {data: football, x: "coverage"}
    },
    React.createElement(Frame),
    React.createElement(Dot, {data: football, ...stackX({offset: "center", y: (d) => +d.value.toFixed(2), fill: "black"})})
  );
}
