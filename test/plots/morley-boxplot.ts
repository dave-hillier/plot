import React from "react";
import {Plot, BoxX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function morleyBoxplot() {
  const morley = await d3.csv<any>("data/morley.csv", d3.autoType);
  return React.createElement(Plot, {x: {grid: true, inset: 6}},
    React.createElement(BoxX, {data: morley, x: "Speed", y: "Expt"})
  );
}
