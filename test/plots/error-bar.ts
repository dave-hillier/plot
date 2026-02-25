import React from "react";
import {Plot, BarX, BarY, RuleY, RuleX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function errorBarX() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(BarX, {data: alphabet, x: "frequency", y: "letter", sort: {y: "-x"}, fill: "steelblue"}),
    React.createElement(RuleY, {data: alphabet, x1: (d) => d.frequency * 0.9, x2: (d) => d.frequency * 1.1, y: "letter", marker: "tick"}),
    React.createElement(RuleX, {data: [0]})
  );
}

export async function errorBarY() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(BarY, {data: alphabet, x: "letter", y: "frequency", sort: {x: "-y"}, fill: "steelblue"}),
    React.createElement(RuleX, {data: alphabet, x: "letter", y1: (d) => d.frequency * 0.9, y2: (d) => d.frequency * 1.1, marker: "tick"}),
    React.createElement(RuleY, {data: [0]})
  );
}
