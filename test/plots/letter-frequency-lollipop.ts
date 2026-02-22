import React from "react";
import {Plot, RuleX, Dot, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function letterFrequencyLollipop() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return React.createElement(Plot, {y: {grid: true}},
    React.createElement(RuleX, {data: alphabet, x: "letter", y: "frequency"}),
    React.createElement(Dot, {data: alphabet, x: "letter", y: "frequency", fill: "currentColor"}),
    React.createElement(RuleY, {data: [0]})
  );
}
