import React from "react";
import {Plot, DelaunayMesh, Hull} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinCulmenDelaunaySpecies() {
  const data = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(DelaunayMesh, {
      data,
      x: "culmen_depth_mm",
      y: "culmen_length_mm",
      z: "species",
      stroke: "species",
      strokeOpacity: 1
    }),
    React.createElement(Hull, {data, x: "culmen_depth_mm", y: "culmen_length_mm", stroke: "species", strokeWidth: 3})
  );
}
