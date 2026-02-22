import React from "react";
import {Plot, RectY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function randomBins() {
  const random = d3.randomExponential.source(d3.randomLcg(42))(1);
  const data = Array.from({length: 100}, random);
  return React.createElement(Plot, {},
    React.createElement(RectY, {data, ...binX()})
  );
}
