import React from "react";
import {Plot, Line, RuleY, map, window as win} from "../../src/react/index.js";
import * as d3 from "d3";

export async function metroUnemploymentSlope() {
  const bls = await d3.csv<any>("data/bls-metro-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {
      y: {
        grid: true
      },
      color: {
        scheme: "buylrd",
        domain: [-0.5, 0.5]
      }
    },
    React.createElement(Line, {
      data: bls,
      ...map(
        {stroke: win({k: 2, reduce: "difference"})},
        {x: "date", y: "unemployment", z: "division", stroke: "unemployment"}
      )
    }),
    React.createElement(RuleY, {data: [0]})
  );
}
