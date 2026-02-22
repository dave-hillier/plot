import React from "react";
import {Plot, Dot, dodgeX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinFacetDodgeSymbol() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      grid: true,
      nice: true,
      symbol: {
        legend: true
      }
    },
    React.createElement(Dot, {data: penguins, ...dodgeX("left", {y: "body_mass_g", symbol: "species", stroke: "species"})})
  );
}
