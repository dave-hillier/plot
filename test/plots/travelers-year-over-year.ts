import React from "react";
import {Plot, RuleY, Line, Text} from "../../src/react/index.js";
import * as d3 from "d3";

export async function travelersYearOverYear() {
  const data = await d3.csv<any>("data/travelers.csv", d3.autoType);
  return React.createElement(Plot, {
      y: {
        grid: true,
        nice: true,
        label: "Travelers per day (millions)",
        transform: (d) => d / 1e6
      }
    },
    React.createElement(RuleY, {data: [0]}),
    React.createElement(Line, {
      data,
      x: "date",
      y: "previous",
      stroke: "#bab0ab"
    }),
    React.createElement(Line, {
      data,
      x: "date",
      y: "current"
    }),
    React.createElement(Text, {
      data: data.slice(0, 1),
      x: "date",
      y: "previous",
      text: ["2019"],
      fill: "#bab0ab",
      dy: -8
    }),
    React.createElement(Text, {
      data: data.slice(0, 1),
      x: "date",
      y: "current",
      text: ["2020"],
      dy: 8
    })
  );
}
