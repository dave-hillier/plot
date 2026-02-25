import React from "react";
import {Plot, BarY, RuleY, groupZ} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinSpeciesIslandRelative() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      y: {
        percent: true
      },
      fx: {
        tickSize: 6
      },
      facet: {
        data: penguins,
        x: "species"
      }
    },
    React.createElement(BarY, {data: penguins, ...groupZ({y: "proportion-facet", sort: "z"}, {fill: "island"})}),
    React.createElement(RuleY, {data: [0]})
  );
}
