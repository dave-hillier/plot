import React from "react";
import {Plot, Dot, hexbin} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinHexbinColorExplicit() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {grid: true},
    React.createElement(Dot, {
      data: penguins,
      ...hexbin(
        {r: "count", fill: (d) => (d.length > 3 ? "black" : "red")},
        {x: "culmen_depth_mm", y: "culmen_length_mm"}
      )
    })
  );
}
