import React from "react";
import {Plot, BarX, groupY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function athletesSportSex() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      marginLeft: 100,
      x: {
        label: "Women (%)",
        domain: [0, 100],
        ticks: 10,
        percent: true,
        grid: true
      },
      y: {
        label: null
      }
    },
    React.createElement(BarX, {data: athletes, ...groupY({x: "mean"}, {x: (d) => d.sex === "female", y: "sport", sort: {y: "x"}})})
  );
}
