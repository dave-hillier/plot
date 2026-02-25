import React from "react";
import {Plot, AreaY, LineY, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function availability() {
  const data = await d3.csv<any>("data/availability.csv", d3.autoType);
  const sum = (d) => (d.length ? d3.sum(d) : NaN); // force gaps
  return React.createElement(Plot, {height: 180},
    React.createElement(AreaY, {
      data,
      x: "date",
      y: "value",
      interval: "day",
      reduce: sum,
      curve: "step",
      fill: "#f2f2fe"
    }),
    React.createElement(LineY, {
      data,
      x: "date",
      y: "value",
      interval: "day",
      reduce: sum,
      curve: "step"
    }),
    React.createElement(RuleY, {data: [0]})
  );
}
