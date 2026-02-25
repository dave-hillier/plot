import React from "react";
import {Plot, DelaunayLink} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinCulmenDelaunay() {
  const data = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(DelaunayLink, {data, x: "culmen_depth_mm", y: "culmen_length_mm", stroke: "culmen_length_mm"})
  );
}
