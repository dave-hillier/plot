import React from "react";
import {Plot, Line, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function metroUnemployment() {
  const data = await d3.csv<any>("data/bls-metro-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Line, {data, x: "date", y: "unemployment", z: "division"}),
    React.createElement(RuleY, {data: [0]})
  );
}
