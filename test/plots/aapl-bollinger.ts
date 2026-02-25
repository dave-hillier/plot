import React from "react";
import {Plot, BollingerY, Line, Frame, GridY, GridX, AxisY, AxisX, RuleX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function aaplBollinger() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {y: {grid: true}},
    React.createElement(BollingerY, {data: aapl, x: "Date", y: "Close", stroke: "blue"}),
    React.createElement(Line, {data: aapl, x: "Date", y: "Close", strokeWidth: 1})
  );
}

export async function aaplBollingerGridInterval() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Frame, {fill: "#eaeaea"}),
    React.createElement(GridY, {tickSpacing: 35, stroke: "#fff", strokeOpacity: 1, strokeWidth: 0.5}),
    React.createElement(GridY, {tickSpacing: 70, stroke: "#fff", strokeOpacity: 1}),
    React.createElement(AxisY, {tickSpacing: 70}),
    React.createElement(GridX, {tickSpacing: 40, stroke: "#fff", strokeOpacity: 1, strokeWidth: 0.5}),
    React.createElement(GridX, {tickSpacing: 80, stroke: "#fff", strokeOpacity: 1}),
    React.createElement(AxisX, {tickSpacing: 80}),
    React.createElement(BollingerY, {data: aapl, x: "Date", y: "Close", stroke: "blue"}),
    React.createElement(Line, {data: aapl, x: "Date", y: "Close", strokeWidth: 1})
  );
}

export async function aaplBollingerGridSpacing() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Frame, {fill: "#eaeaea"}),
    React.createElement(GridY, {interval: 10, stroke: "#fff", strokeOpacity: 1, strokeWidth: 0.5}),
    React.createElement(GridY, {interval: 20, stroke: "#fff", strokeOpacity: 1}),
    React.createElement(AxisY, {interval: 20}),
    React.createElement(GridX, {interval: "3 months", stroke: "#fff", strokeOpacity: 1, strokeWidth: 0.5}),
    React.createElement(GridX, {interval: "1 year", stroke: "#fff", strokeOpacity: 1}),
    React.createElement(AxisX, {interval: "1 year"}),
    React.createElement(BollingerY, {data: aapl, x: "Date", y: "Close", stroke: "blue"}),
    React.createElement(Line, {data: aapl, x: "Date", y: "Close", strokeWidth: 1})
  );
}

export async function aaplBollingerCandlestick() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {
      x: {domain: [new Date("2014-01-01"), new Date("2014-06-01")]},
      y: {domain: [68, 92], grid: true},
      color: {domain: [-1, 0, 1], range: ["red", "black", "green"]}
    },
    React.createElement(BollingerY, {data: aapl, x: "Date", y: "Close", stroke: "none", clip: true}),
    React.createElement(RuleX, {data: aapl, x: "Date", y1: "Low", y2: "High", strokeWidth: 1, clip: true}),
    React.createElement(RuleX, {
      data: aapl,
      x: "Date",
      y1: "Open",
      y2: "Close",
      strokeWidth: 3,
      stroke: (d) => Math.sign(d.Close - d.Open),
      clip: true
    })
  );
}
