import React from "react";
import {Plot, BarY, binY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function intervalAwareBin() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {x: {interval: 10}},
    React.createElement(BarY, {data: olympians, ...binY({fill: "count"}, {x: "weight", y: "height", inset: 0})})
  );
}

export async function intervalAwareGroup() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {x: {interval: "5 years"}},
    React.createElement(BarY, {data: olympians, ...groupX({y: "count"}, {x: "date_of_birth"})})
  );
}

export async function intervalAwareStack() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {x: {interval: "5 years"}},
    React.createElement(BarY, {data: olympians, x: "date_of_birth", y: 1})
  );
}
