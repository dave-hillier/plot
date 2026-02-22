import React from "react";
import {Plot, Dot, transform} from "../../src/react/index.js";
import * as d3 from "d3";

// https://observablehq.com/@mbostock/evenly-spaced-sampling
function samples(array, m) {
  if (!((m = Math.floor(m)) > 0)) return []; // return nothing
  const n = array.length;
  if (!(n > m)) return [...array]; // return everything
  if (m === 1) return [array[n >> 1]]; // return the midpoint
  return Array.from({length: m}, (_, i) => array[Math.round((i / (m - 1)) * (n - 1))]);
}

function sample(n, options) {
  return transform(options, (data, facets) => ({data, facets: Array.from(facets, (I) => samples(I, n))}));
}

export async function diamondsCaratSampling() {
  const data = await d3.csv<any>("data/diamonds.csv", d3.autoType);
  return React.createElement(Plot, {marginLeft: 44},
    React.createElement(Dot, {
      data,
      ...sample(2000, {
        x: "carat",
        y: "price",
        r: 1,
        fill: "currentColor"
      })
    })
  );
}
