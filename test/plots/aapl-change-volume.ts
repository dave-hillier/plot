import React from "react";
import {Plot, RuleX, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function aaplChangeVolume() {
  const data = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {
      x: {
        label: "Daily change (%)",
        tickFormat: "+f"
      },
      y: {
        label: "Volume (log\u2081\u2080)",
        transform: Math.log10
      },
      grid: true
    },
    React.createElement(RuleX, {data: [0]}),
    React.createElement(Dot, {
      data,
      x: (d) => ((d.Close - d.Open) / d.Open) * 100,
      y: "Volume",
      r: "Volume"
    })
  );
}
