import React from "react";
import {Plot, BarY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function ibmTrading() {
  const ibm = await d3.csv<any>("data/ibm.csv", d3.autoType).then((data) => data.slice(-20));
  return React.createElement(Plot, {
      x: {interval: "day"},
      y: {transform: (d) => d / 1e6, label: "Volume (USD, millions)", grid: true}
    },
    React.createElement(BarY, {data: ibm, x: "Date", y: "Volume"})
  );
}
