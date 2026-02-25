import React from "react";
import {Plot, Frame, Text, RuleY, BarY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function bandClip() {
  return React.createElement(Plot, {
      y: {type: "band"},
      clip: true
    },
    React.createElement(Frame, {}),
    React.createElement(Text, {data: ["A", "B", "C"], x: (d) => d, y: (d) => d, fontSize: 50})
  );
}

export async function bandClip2() {
  const data = [
    {Date: new Date("2022-12-01"), Count: 10},
    {Date: new Date("2022-12-02"), Count: 1},
    {Date: new Date("2022-12-02"), Count: 1},
    {Date: new Date("2022-12-03"), Count: 2},
    {Date: new Date("2022-12-04"), Count: 3},
    {Date: new Date("2022-12-05"), Count: 4},
    {Date: new Date("2022-12-06"), Count: 5}
  ];
  return React.createElement(Plot, {
      grid: true,
      x: {interval: d3.utcDay}
    },
    React.createElement(RuleY, {data: [0]}),
    React.createElement(BarY, {data, ...groupX({y: "sum"}, {x: "Date", y: "Count", rx: 6, insetBottom: -6, clip: "frame"})})
  );
}
