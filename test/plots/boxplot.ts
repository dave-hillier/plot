import React from "react";
import {Plot, BoxX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function boxplot() {
  return React.createElement(Plot, {},
    React.createElement(BoxX, {data: [0, 3, 4.4, 4.5, 4.6, 5, 7]})
  );
}

export async function boxplotFacetInterval() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      fy: {
        grid: true,
        tickFormat: String, // for debugging
        interval: 0.1,
        reverse: true
      }
    },
    React.createElement(BoxX, {
      data: olympians.filter((d) => d.height),
      x: "weight",
      fy: "height"
    })
  );
}

export async function boxplotFacetNegativeInterval() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      fy: {
        grid: true,
        tickFormat: String, // for debugging
        interval: -10, // 0.1
        reverse: true
      }
    },
    React.createElement(BoxX, {
      data: olympians.filter((d) => d.height),
      x: "weight",
      fy: "height"
    })
  );
}
