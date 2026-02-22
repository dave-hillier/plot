import React from "react";
import {Plot, BarX, Frame, Text, groupY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinFacetAnnotated() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      marginLeft: 75,
      facet: {marginRight: 70}
    },
    React.createElement(BarX, {data: penguins, ...groupY({x: "count"}, {fy: "island", y: "species", fill: "sex"})}),
    React.createElement(Frame, {}),
    React.createElement(Text, {
      data: ["Torgersen Island only has Adelie penguins!"],
      fy: ["Torgersen"],
      frameAnchor: "top-right",
      dy: 4,
      dx: -4
    })
  );
}
