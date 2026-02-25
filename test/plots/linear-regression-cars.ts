import React from "react";
import {Plot, Dot, LinearRegressionY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function linearRegressionCars() {
  const cars = await d3.csv<any>("data/cars.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Dot, {data: cars, x: "weight (lb)", y: "economy (mpg)", r: 2}),
    React.createElement(LinearRegressionY, {data: cars, x: "weight (lb)", y: "economy (mpg)", ci: 0.99})
  );
}
