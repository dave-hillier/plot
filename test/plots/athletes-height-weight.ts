import React from "react";
import {Plot, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function athletesHeightWeight() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      grid: true,
      height: 640
    },
    React.createElement(Dot, {data: athletes, x: "weight", y: "height"})
  );
}
