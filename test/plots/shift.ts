import React from "react";
import {Plot, Arrow, shiftX as shiftXTransform, shiftY as shiftYTransform} from "../../src/react/index.js";
import * as d3 from "d3";

export async function shiftX() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Arrow, {data: aapl, ...shiftXTransform("quarter", {x: "Date", y: "Close", bend: true})})
  );
}

export async function shiftY() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Arrow, {data: aapl, ...shiftYTransform("quarter", {y: "Date", x: "Close", bend: true})})
  );
}
