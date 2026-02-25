import React from "react";
import {Plot, RuleY, Line, GridY, AxisY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function aaplFancyAxis() {
  const AAPL = await d3.csv<{Close: number; Date: Date}>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(RuleY, {data: [0]}),
    React.createElement(Line, {data: AAPL, x: "Date", y: "Close"}),
    React.createElement(GridY, {x: (y) => AAPL.find((d) => d.Close >= y)?.Date, insetLeft: -6}),
    React.createElement(AxisY, {x: (y) => AAPL.find((d) => d.Close >= y)?.Date, insetLeft: -6, textStroke: "white"})
  );
}
