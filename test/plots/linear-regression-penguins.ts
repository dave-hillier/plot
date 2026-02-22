import React from "react";
import {Plot, Dot, LinearRegressionY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function linearRegressionPenguins() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {grid: true},
    React.createElement(Dot, {data: penguins, x: "culmen_length_mm", y: "culmen_depth_mm", fill: "species"}),
    React.createElement(LinearRegressionY, {data: penguins, x: "culmen_length_mm", y: "culmen_depth_mm", stroke: "species"}),
    React.createElement(LinearRegressionY, {data: penguins, x: "culmen_length_mm", y: "culmen_depth_mm"})
  );
}
