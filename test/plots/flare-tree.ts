import React from "react";
import {Plot, TreeMark} from "../../src/react/index.js";
import * as d3 from "d3";

export async function flareTree() {
  const flare = await d3.csv<any>("data/flare.csv", d3.autoType);
  return React.createElement(Plot, {
      axis: null,
      inset: 10,
      insetLeft: 30,
      insetRight: 120,
      height: 1800
    },
    React.createElement(TreeMark, {data: flare, markerEnd: "arrow", path: "name", delimiter: "."})
  );
}
