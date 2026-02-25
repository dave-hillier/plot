import React from "react";
import {Plot, AreaY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function pairsArea() {
  return React.createElement(Plot, {axis: null, height: 140},
    React.createElement(AreaY, {data: {length: 15}, y: d3.randomLcg(42), stroke: (d, i) => i >> 1})
  );
}
