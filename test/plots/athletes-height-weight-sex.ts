import React from "react";
import {Plot, Rect, bin} from "../../src/react/index.js";
import * as d3 from "d3";

export async function athletesHeightWeightSex() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      round: true,
      grid: true,
      height: 640,
      y: {
        ticks: 10
      }
    },
    React.createElement(Rect, {data: athletes, ...bin({fillOpacity: "count"}, {x: "weight", y: "height", fill: "sex", thresholds: 50})})
  );
}
