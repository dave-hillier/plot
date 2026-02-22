import React from "react";
import {Plot, BarX, TextX, RuleX, stackX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function wealthBritainBar() {
  const data = await d3.csv<any>("data/wealth-britain.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(BarX, {data, ...stackX({x: "wealth", fill: "age"})}),
    React.createElement(TextX, {data, ...stackX({x: "wealth", text: "age"})}),
    React.createElement(RuleX, {data: [0, 100]})
  );
}
