import React from "react";
import {Plot, AreaY, LineY, AreaX, LineX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function denseIntervalAreaY() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(AreaY, {data: aapl, x: "Date", reduce: "count", interval: "month"})
  );
}

export async function denseIntervalLineY() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(LineY, {data: aapl, x: "Date", reduce: "count", interval: "month"})
  );
}

export async function denseIntervalAreaX() {
  return React.createElement(Plot, {width: 200},
    React.createElement(AreaX, {
      data: {length: 1000},
      y: d3.randomNormal.source(d3.randomLcg(42))(),
      reduce: "count",
      interval: 0.5,
      curve: "basis"
    })
  );
}

export async function denseIntervalLineX() {
  return React.createElement(Plot, {width: 200},
    React.createElement(LineX, {
      data: {length: 1000},
      y: d3.randomNormal.source(d3.randomLcg(42))(),
      reduce: "count",
      interval: 0.5,
      curve: "basis"
    })
  );
}
