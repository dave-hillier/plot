import React from "react";
import {Plot, GridX, AreaY, Line, Dot, Text} from "../../src/react/index.js";
import * as d3 from "d3";

export async function covidIhmeProjectedDeaths() {
  const data = await d3.csv<any>("data/covid-ihme-projected-deaths.csv", d3.autoType);
  const i = data.findIndex((d) => d.projected) - 1;
  return React.createElement(Plot, {
      width: 960,
      height: 600,
      y: {
        type: "log",
        label: "Deaths per day to COVID-19 (projected)",
        tickFormat: ",~f",
        grid: true
      }
    },
    React.createElement(GridX, {}),
    React.createElement(AreaY, {
      data,
      x: "date",
      y1: (d) => Math.max(1, d.lower),
      y2: "upper",
      title: () => "cone of uncertainty",
      fillOpacity: 0.2
    }),
    React.createElement(Line, {
      data: data.slice(0, i + 1),
      x: "date",
      y: "mean",
      title: () => "actual data"
    }),
    React.createElement(Line, {
      data: data.slice(i),
      x: "date",
      y: "mean",
      title: () => "projected values",
      strokeDasharray: "2,2"
    }),
    React.createElement(Dot, {
      data: [data[i]],
      x: "date",
      y: "mean",
      fill: "currentColor"
    }),
    React.createElement(Text, {
      data: [data[i]],
      x: "date",
      y: "mean",
      text: "mean",
      textAnchor: "start",
      dx: 6
    })
  );
}
