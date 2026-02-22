import React from "react";
import {Plot, AreaY, RuleY, stackY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function industryUnemploymentShare() {
  const data = await d3.csv<any>("data/bls-industry-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {y: {grid: true, tickFormat: "%"}},
    React.createElement(AreaY, {
      data,
      ...stackY({
        x: "date",
        y: "unemployed",
        fill: "industry",
        offset: "normalize",
        title: "industry"
      })
    }),
    React.createElement(RuleY, {data: [0]})
  );
}
