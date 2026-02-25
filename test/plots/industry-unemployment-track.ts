import React from "react";
import {Plot, BarX, DotX, select} from "../../src/react/index.js";
import * as d3 from "d3";

export async function industryUnemploymentTrack() {
  const data = await d3.csv<any>("data/bls-industry-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {
      facet: {data, y: "industry"},
      marginLeft: 140,
      color: {scheme: "plasma", reverse: true}
    },
    React.createElement(BarX, {
      data,
      x: "date",
      interval: "month",
      fill: "unemployed",
      title: "unemployed",
      sort: {fy: "-fill"},
      inset: 0
    }),
    React.createElement(DotX, {
      data,
      ...select(
        {title: "max"},
        {
          x: "date",
          interval: "month",
          stroke: "#fff",
          fill: "black",
          strokeWidth: 1.5,
          title: "unemployed",
          z: "industry"
        }
      )
    }),
    React.createElement(DotX, {
      data,
      ...select(
        {value: "min"},
        {
          x: "date",
          interval: "month",
          value: "unemployed",
          fill: "#333",
          title: "unemployed",
          z: "industry"
        }
      )
    })
  );
}
