import React from "react";
import {Plot, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinSizeSymbols() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      grid: true,
      x: {
        label: "Body mass (g)"
      },
      y: {
        label: "Flipper length (mm)"
      },
      symbol: {
        legend: true
      }
    },
    React.createElement(Dot, {data: penguins, x: "body_mass_g", y: "flipper_length_mm", stroke: "species", symbol: "species"})
  );
}
