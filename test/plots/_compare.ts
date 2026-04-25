import React from "react";
import {Plot, BollingerY, Line} from "../../src/react/index.js";
import * as Plot_ from "../../src/index.js";
import * as d3 from "d3";

// Imperative Bollinger for visual comparison
export async function _imperativeBollinger() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return Plot_.plot({
    y: {grid: true},
    marks: [
      Plot_.bollingerY(aapl, {x: "Date", y: "Close", stroke: "blue"}),
      Plot_.lineY(aapl, {x: "Date", y: "Close", strokeWidth: 1})
    ]
  });
}

export async function _reactBollinger() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {y: {grid: true}},
    React.createElement(BollingerY, {data: aapl, x: "Date", y: "Close", stroke: "blue"}),
    React.createElement(Line, {data: aapl, x: "Date", y: "Close", strokeWidth: 1})
  );
}
