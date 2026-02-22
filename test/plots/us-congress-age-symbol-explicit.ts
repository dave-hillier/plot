import React from "react";
import {Plot, Dot, RuleY, stackY2} from "../../src/react/index.js";
import * as d3 from "d3";

export async function usCongressAgeSymbolExplicit() {
  const data = await d3.csv<any>("data/us-congress-members.csv", d3.autoType);
  return React.createElement(Plot, {
      height: 300,
      x: {nice: true, label: "Age"},
      y: {grid: true, label: "Frequency"}
    },
    React.createElement(Dot, {
      data,
      ...stackY2({
        x: (d) => 2021 - d.birth,
        symbol: (d) => (d.gender === "F" ? "plus" : "times"),
        r: 3,
        title: "full_name"
      })
    }),
    React.createElement(RuleY, {data: [0]})
  );
}
