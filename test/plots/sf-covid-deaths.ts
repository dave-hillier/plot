import React from "react";
import {Plot, AreaY, RuleY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function sfCovidDeaths() {
  const cases = await d3.csv<any>("data/sf-covid.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(AreaY, {
      data: cases,
      ...binX(
        {
          y: "sum",
          filter: null,
          sort: "z"
        },
        {
          x: "specimen_collection_date",
          y: "case_count",
          filter: (d) => d.case_disposition === "Death",
          fill: "transmission_category",
          curve: "step",
          thresholds: "week"
        }
      )
    }),
    React.createElement(RuleY, {data: [0]})
  );
}
