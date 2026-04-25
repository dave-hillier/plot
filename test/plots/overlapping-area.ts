import React from "react";
import {Plot, AreaY, LineY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function overlappingArea() {
  const industries = await d3.csv<any>("data/bls-industry-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(AreaY, {data: industries, x: "date", y2: "unemployed", z: "industry", fillOpacity: 0.1}),
    React.createElement(LineY, {data: industries, x: "date", y: "unemployed", z: "industry", strokeWidth: 1})
  );
}
