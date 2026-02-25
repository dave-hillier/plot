import React from "react";
import {Plot, Dot, BoxX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function internFacetDate() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {grid: true, fy: {interval: d3.utcYear.every(10)}},
    React.createElement(Dot, {data: athletes, x: "weight", y: "height", fy: "date_of_birth"})
  );
}

export async function internFacetNaN() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {fy: {transform: (d) => (d ? Math.floor(d * 10) / 10 : NaN)}},
    React.createElement(BoxX, {data: athletes, x: "weight", y: "sex", fy: "height", stroke: "sex", r: 1})
  );
}
