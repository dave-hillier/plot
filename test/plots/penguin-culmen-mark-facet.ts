import React from "react";
import {Plot, Frame, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinCulmenMarkFacet() {
  const data = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      height: 600,
      facet: {marginRight: 80}
    },
    React.createElement(Frame, {}),
    React.createElement(Dot, {
      data,
      fx: "sex",
      fy: "species",
      facet: "exclude",
      x: "culmen_depth_mm",
      y: "culmen_length_mm",
      r: 2,
      fill: "#ddd"
    }),
    React.createElement(Dot, {
      data,
      fx: "sex",
      fy: "species",
      x: "culmen_depth_mm",
      y: "culmen_length_mm"
    })
  );
}
