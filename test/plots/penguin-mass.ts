import React from "react";
import {Plot, RectY, RuleY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinMass() {
  const data = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      x: {
        round: true,
        label: "Body mass (g)"
      },
      y: {
        grid: true
      }
    },
    React.createElement(RectY, {data, ...binX({y: "count"}, {x: "body_mass_g"})}),
    React.createElement(RuleY, {data: [0]})
  );
}
