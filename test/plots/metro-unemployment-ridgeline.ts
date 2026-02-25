import React from "react";
import {Plot, AreaY, Line, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function metroUnemploymentRidgeline() {
  const data = await d3.csv<any>("data/bls-metro-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {
      width: 960,
      height: 1080,
      y: {
        insetTop: -40,
        axis: null
      },
      fy: {
        round: true,
        label: null
      },
      facet: {
        data,
        y: "division",
        marginLeft: 300
      }
    },
    React.createElement(AreaY, {data, x: "date", y: "unemployment", fill: "#eee"}),
    React.createElement(Line, {data, x: "date", y: "unemployment", sort: {fy: "-y"}}),
    React.createElement(RuleY, {data: [0]})
  );
}
