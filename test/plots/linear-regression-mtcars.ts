import React from "react";
import {Plot, Dot, LinearRegressionY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function linearRegressionMtcars() {
  const mtcars = await d3.csv<any>("data/mtcars.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Dot, {data: mtcars, x: "wt", y: "hp", r: 2}),
    React.createElement(LinearRegressionY, {data: mtcars, x: "wt", y: "hp", stroke: null, ci: 0.8}),
    React.createElement(LinearRegressionY, {data: mtcars, x: "wt", y: "hp"})
  );
}
