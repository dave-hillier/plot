import React from "react";
import {Plot, BarY, RuleY} from "../../src/react/index.js";

export async function ordinalBar() {
  return React.createElement(Plot, {
      y: {
        grid: true
      }
    },
    React.createElement(BarY, {data: "ABCDEF"}),
    React.createElement(RuleY, {data: [0]})
  );
}
