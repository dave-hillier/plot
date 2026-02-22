import React from "react";
import {Plot, Dot, Text, dodgeY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function dodgeTextRadius() {
  const random = d3.randomLcg(42);
  const length = 100;
  const X = Float64Array.from({length}, random);
  const R = Float64Array.from({length}, random);
  return React.createElement(Plot, {
      height: 400,
      nice: true,
      r: {
        range: [0, 22]
      }
    },
    React.createElement(Dot, {data: {length}, ...dodgeY({x: X, r: R})}),
    React.createElement(Text, {data: {length}, ...dodgeY({x: X, r: R})})
  );
}
