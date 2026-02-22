import React from "react";
import {Plot, Line, Dot, groupX, binY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function carsMpg() {
  const data = await d3.csv<any>("data/cars.csv", d3.autoType);
  return React.createElement(Plot, {
      x: {
        type: "point"
      },
      y: {
        grid: true,
        zero: true
      },
      color: {
        type: "ordinal"
      }
    },
    React.createElement(Line, {
      data,
      ...groupX(
        {y: "mean", sort: "x"},
        {
          x: "year",
          y: "economy (mpg)",
          stroke: "cylinders",
          curve: "basis"
        }
      )
    }),
    React.createElement(Dot, {
      data,
      ...binY(
        {r: "count"},
        {
          x: "year",
          y: "economy (mpg)",
          stroke: "cylinders",
          thresholds: 20
        }
      )
    })
  );
}
