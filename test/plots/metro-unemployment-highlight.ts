import React from "react";
import {Plot, RuleY, Line} from "../../src/react/index.js";
import * as d3 from "d3";

export async function metroUnemploymentHighlight() {
  const bls = await d3.csv<any>("data/bls-metro-unemployment.csv", d3.autoType);
  const highlight = (d) => /, MI /.test(d.division);
  return React.createElement(Plot, {
      y: {
        grid: true,
        label: "Unemployment (%)"
      },
      color: {
        domain: [false, true],
        range: ["#ccc", "red"]
      }
    },
    React.createElement(RuleY, {data: [0]}),
    React.createElement(Line, {
      data: bls,
      x: "date",
      y: "unemployment",
      z: "division",
      sort: highlight,
      stroke: highlight
    })
  );
}
