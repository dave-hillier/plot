import React from "react";
import {Plot, BarX, Text, RuleX, stackX, groupZ} from "../../src/react/index.js";
import * as d3 from "d3";

export async function softwareVersions() {
  const data = await d3.csv<any>("data/software-versions.csv");

  function stack({text = undefined, fill = undefined, ...options}) {
    return stackX({
      ...groupZ(
        {
          x: "proportion",
          text: "first"
        },
        {
          z: "version",
          order: "value",
          text,
          fill
        }
      ),
      reverse: true,
      ...options
    });
  }

  return React.createElement(Plot, {
      x: {
        percent: true
      },
      color: {
        type: "ordinal",
        scheme: "blues"
      }
    },
    React.createElement(BarX, {data, ...stack({fill: "version", insetLeft: 0.5, insetRight: 0.5})}),
    React.createElement(Text, {data, ...stack({text: "version"})}),
    React.createElement(RuleX, {data: [0, 1]})
  );
}
