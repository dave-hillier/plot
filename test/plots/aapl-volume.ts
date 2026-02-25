import React from "react";
import {Plot, RectY, RuleY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function aaplVolume() {
  const data = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {
      x: {
        round: true,
        label: "Trade volume (log\u2081\u2080)"
      },
      y: {
        grid: true,
        percent: true
      }
    },
    React.createElement(RectY, {data, ...binX({y: "proportion"}, {x: (d) => Math.log10(d.Volume)})}),
    React.createElement(RuleY, {data: [0]})
  );
}
