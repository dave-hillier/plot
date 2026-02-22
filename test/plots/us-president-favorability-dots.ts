import React from "react";
import {Plot, RuleY, Image} from "../../src/react/index.js";
import * as d3 from "d3";

export async function usPresidentFavorabilityDots() {
  const data = await d3.csv<any>("data/us-president-favorability.csv", d3.autoType);
  return React.createElement(Plot, {
      inset: 30,
      width: 960,
      height: 600,
      x: {
        label: "Date of first inauguration"
      },
      y: {
        grid: true,
        label: "Net favorability (%)",
        percent: true,
        tickFormat: "+f"
      }
    },
    React.createElement(RuleY, {data: [0]}),
    React.createElement(Image, {
      data,
      x: "First Inauguration Date",
      y: (d) =>
        (d["Very Favorable %"] + d["Somewhat Favorable %"] - d["Very Unfavorable %"] - d["Somewhat Unfavorable %"]) /
        100,
      width: 60,
      src: "Portrait URL",
      title: "Name"
    })
  );
}
