import React from "react";
import {Plot, BarY, RuleY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinSpeciesIslandSex() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      x: {
        tickFormat: (d) => (d === null ? "N/A" : d)
      },
      y: {
        grid: true
      },
      facet: {
        data: penguins,
        x: "species"
      }
    },
    React.createElement(BarY, {data: penguins, ...groupX({y: "count"}, {x: "sex", fill: "island"})}),
    React.createElement(RuleY, {data: [0]})
  );
}
