import React from "react";
import {Plot, RectY, RuleY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function uniformRandomDifference() {
  const random = d3.randomLcg(42);
  return React.createElement(Plot, {
      x: {
        label: "Difference of two uniform random variables",
        labelAnchor: "center"
      },
      y: {
        grid: true,
        percent: true
      }
    },
    React.createElement(RectY, {data: {length: 10000}, ...binX({y: "proportion"}, {x: () => random() - random()})}),
    React.createElement(RuleY, {data: [0]})
  );
}
