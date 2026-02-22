import React from "react";
import {Plot, BarX, Frame, valueof} from "../../src/react/index.js";
import * as d3 from "d3";

export async function facetReindex() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  const island = valueof(penguins, "island");
  return React.createElement(Plot, {
      width: 830,
      marginLeft: 74,
      marginRight: 68,
      height: 130,
      x: {domain: [0, penguins.length], round: true},
      y: {label: "facet option", axis: "right"},
      facet: {data: penguins, y: island},
      fy: {label: "facet value"}
    },
    React.createElement(BarX, {
      data: penguins,
      facet: "exclude",
      fill: island,
      x: 1,
      y: () => "exclude",
      fillOpacity: 0.5,
      insetRight: 0.5
    }),
    React.createElement(BarX, {
      data: penguins,
      facet: "include",
      fill: island,
      x: 1,
      y: () => "include"
    }),
    React.createElement(Frame, {})
  );
}
