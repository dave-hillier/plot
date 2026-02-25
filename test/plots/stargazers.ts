import React from "react";
import {Plot, RuleY, Line, Text, selectLast} from "../../src/react/index.js";
import * as d3 from "d3";

export async function stargazers() {
  const stargazers = await d3.csv<any>("data/stargazers.csv", d3.autoType);
  return React.createElement(Plot, {
      marginRight: 40,
      y: {
        grid: true,
        label: "Stargazers"
      }
    },
    React.createElement(RuleY, {data: [0]}),
    React.createElement(Line, {data: stargazers, x: "date", y: (_, i) => i}),
    React.createElement(Text, {data: stargazers, ...selectLast({x: "date", y: (_, i) => i, textAnchor: "start", dx: 3})})
  );
}
