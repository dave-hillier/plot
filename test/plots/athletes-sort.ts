import React from "react";
import {Plot, BarX, Frame, Dot, TickX, groupZ, groupY, sort as sortTransform} from "../../src/react/index.js";
import * as d3 from "d3";

export async function athletesSortFacet() {
  const athletes = await d3.csv<{sex: string; sport: string}>("data/athletes.csv", d3.autoType);
  const female = (d: (typeof athletes)[number]) => d.sex === "female";
  return React.createElement(Plot, {
      marginLeft: 100
    },
    React.createElement(BarX, {data: athletes, ...groupZ({x: "mean"}, {x: female, fy: "sport", sort: {fy: "x"}})}),
    React.createElement(Frame, {anchor: "left", facet: "super"})
  );
}

export async function athletesSortNationality() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      legend: true
    },
    React.createElement(Dot, {
      data: athletes,
      ...sortTransform("height", {
        y: "weight",
        x: "height",
        stroke: "nationality",
        sort: {color: null, limit: 10}
      })
    })
  );
}

export async function athletesSortNullLimit() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      legend: true
    },
    React.createElement(Dot, {data: athletes, x: "height", y: "weight", stroke: "nationality", sort: {color: null, limit: 10}})
  );
}

export async function athletesSortWeightLimit() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Dot, {data: athletes, x: "weight", y: "nationality", sort: {y: "x", reduce: "median", limit: 10}}),
    React.createElement(TickX, {data: athletes, ...groupY({x: "median"}, {x: "weight", y: "nationality", stroke: "red", strokeWidth: 2})})
  );
}
