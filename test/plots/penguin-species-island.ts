import React from "react";
import {Plot, BarY, RuleY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinSpeciesIsland() {
  const data = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      y: {
        grid: true
      }
    },
    React.createElement(BarY, {data, ...groupX({y: "count", sort: "z"}, {x: "species", fill: "island"})}),
    React.createElement(RuleY, {data: [0]})
  );
}
