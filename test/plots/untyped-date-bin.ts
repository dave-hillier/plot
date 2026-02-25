import React from "react";
import {Plot, RectY, RuleY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function untypedDateBin() {
  const aapl = await d3.csv<any>("data/aapl.csv");
  return React.createElement(Plot, {
      y: {
        transform: (d) => d / 1e6
      }
    },
    React.createElement(RectY, {data: aapl, ...binX({y: "sum"}, {x: "Date", thresholds: "month", y: "Volume"})}),
    React.createElement(RuleY, {data: [0]})
  );
}
