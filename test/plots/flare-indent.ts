import React from "react";
import {Plot, TreeMark} from "../../src/react/index.js";
import * as d3 from "d3";

export async function flareIndent() {
  const flare = await d3.csv<any>("data/flare.csv", d3.autoType);
  return React.createElement(Plot, {
      axis: null,
      inset: 10,
      insetRight: 120,
      round: true,
      width: 200,
      height: 3600
    },
    React.createElement(TreeMark, {
      data: flare,
      strokeWidth: 1,
      r: 2.5,
      curve: "step-before",
      treeLayout: indent,
      path: "name",
      delimiter: "."
    })
  );
}

function indent() {
  return (root) => root.eachBefore((node, i) => ((node.y = node.depth), (node.x = i)));
}
