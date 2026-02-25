import React from "react";
import {Plot, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinCulmenArray() {
  const data = await d3.csv<any>("data/penguins.csv", d3.autoType);
  const culmen_depth_mm = data.map((d) => d.culmen_depth_mm);
  const culmen_length_mm = data.map((d) => d.culmen_length_mm);
  return React.createElement(Plot, {
      height: 600,
      grid: true,
      facet: {
        data,
        x: "sex",
        y: "species",
        marginRight: 80
      }
    },
    React.createElement(Dot, {data, facet: null, x: culmen_depth_mm, y: culmen_length_mm, r: 2, fill: "#ddd"}),
    React.createElement(Dot, {data, x: culmen_depth_mm, y: culmen_length_mm})
  );
}
