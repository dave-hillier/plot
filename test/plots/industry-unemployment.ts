import React from "react";
import {Plot, AreaY, RuleY, stackY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function industryUnemployment() {
  const data = await d3.csv<any>("data/bls-industry-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {marginLeft: 44, y: {grid: true}},
    React.createElement(AreaY, {
      data,
      ...stackY({
        x: "date",
        y: "unemployed",
        fill: "industry",
        title: "industry"
      })
    }),
    React.createElement(RuleY, {data: [0]})
  );
}
