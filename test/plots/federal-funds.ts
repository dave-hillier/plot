import React from "react";
import {Plot, AxisY, GridY, RuleY, Line} from "../../src/react/index.js";
import * as d3 from "d3";

export async function federalFunds() {
  const h15 = d3.csvParse((await d3.text("data/federal-funds.csv")).split("\n").slice(5).join("\n"), d3.autoType);
  return React.createElement(Plot, {
      marginLeft: 0,
      x: {label: null, insetLeft: 28},
      y: {label: "Federal funds rate (% per year)"}
    },
    React.createElement(AxisY, {
      interval: 2,
      tickSize: 0,
      dx: 32,
      dy: -6,
      lineAnchor: "bottom",
      tickFormat: (d) => (d === 10 ? `${d}%` : `${d}   `)
    }),
    React.createElement(GridY, {
      interval: 2,
      strokeDasharray: 1.5,
      strokeOpacity: 0.4
    }),
    React.createElement(RuleY, {data: [0]}),
    React.createElement(Line, {data: h15, x: "Time Period", y: "RIFSPFF_N.BWAW", markerEnd: "dot"})
  );
}
