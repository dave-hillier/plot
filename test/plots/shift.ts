import React from "react";
import {Plot, Arrow, shiftX, shiftY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function shiftX() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Arrow, {data: aapl, ...shiftX("quarter", {x: "Date", y: "Close", bend: true})})
  );
}

export async function shiftY() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Arrow, {data: aapl, ...shiftY("quarter", {y: "Date", x: "Close", bend: true})})
  );
}
