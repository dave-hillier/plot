import React from "react";
import {Plot, Dot, dodgeY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function carsDodge() {
  const cars = await d3.csv<any>("data/cars.csv", d3.autoType);
  return React.createElement(Plot, {
      height: 200,
      x: {line: true}
    },
    React.createElement(Dot, {data: cars, ...dodgeY({x: "weight (lb)", sort: "weight (lb)"})})
  );
}
