import React from "react";
import {Plot, Dot, dodgeY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinFacetDodgeIsland() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      height: 300,
      x: {
        grid: true
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
    React.createElement(Dot, {data: penguins, ...dodgeY("middle", {x: "body_mass_g", fill: "island"})})
  );
}
