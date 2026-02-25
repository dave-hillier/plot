import React from "react";
import {Plot, BarX, Frame, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function athletesSportWeight() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      marginLeft: 100,
      grid: true,
      color: {scheme: "YlGnBu", zero: true}
    },
    React.createElement(BarX, {data: athletes, ...binX({fill: "proportion-facet"}, {x: "weight", fy: "sport", thresholds: 60})}),
    React.createElement(Frame, {anchor: "bottom", facetAnchor: "bottom"})
  );
}
