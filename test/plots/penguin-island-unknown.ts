import React from "react";
import {Plot, BarY, RuleY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinIslandUnknown() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      color: {
        domain: ["Dream"],
        unknown: "#ccc"
      }
    },
    React.createElement(BarY, {data: penguins, ...groupX({y: "count", sort: "z"}, {x: "sex", fill: "island"})}),
    React.createElement(RuleY, {data: [0]})
  );
}
