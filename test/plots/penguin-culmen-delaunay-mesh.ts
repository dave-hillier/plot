import React from "react";
import {Plot, DelaunayMesh, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinCulmenDelaunayMesh() {
  const data = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(DelaunayMesh, {data, x: "culmen_depth_mm", y: "culmen_length_mm"}),
    React.createElement(Dot, {data, x: "culmen_depth_mm", y: "culmen_length_mm"})
  );
}
