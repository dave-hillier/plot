import React from "react";
import {Plot, Frame, Dot, dodgeY, hexbin} from "../../src/react/index.js";
import * as d3 from "d3";

// Test channel transform composition.
export async function penguinDodgeHexbin() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      height: 300,
      x: {
        grid: true,
        inset: 7
      },
      color: {
        legend: true
      },
      facet: {
        data: penguins,
        y: "species",
        label: null,
        marginLeft: 60
      }
    },
    React.createElement(Frame, {}),
    React.createElement(Dot, {data: penguins, ...dodgeY("bottom", {x: "body_mass_g", stroke: "red", r: 3})}),
    React.createElement(Dot, {data: penguins, ...hexbin({}, dodgeY("bottom", {x: "body_mass_g", fill: "black", r: 3, binWidth: 7}))})
  );
}
