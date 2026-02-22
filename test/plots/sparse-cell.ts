import React from "react";
import {Plot, Cell, Text} from "../../src/react/index.js";
import * as d3 from "d3";

export async function sparseCell() {
  const simpsons = d3.sort(await d3.csv<any>("data/simpsons.csv", d3.autoType), (d) => d.number_in_series);
  const data = [...simpsons.slice(0, 26), ...simpsons.slice(-10)];
  return React.createElement(Plot, {
      grid: 20,
      padding: 0.05,
      x: {
        label: "Episode",
        axis: "top",
        interval: 1
      },
      y: {
        label: "Season",
        interval: 1
      },
      color: {
        scheme: "PiYG",
        type: "linear",
        unknown: "#ddd"
      },
      height: 640
    },
    React.createElement(Cell, {data, x: "number_in_season", y: "season", fill: "imdb_rating"}),
    React.createElement(Text, {data, x: "number_in_season", y: "season", text: (d) => (d.imdb_rating == null ? "-" : d.imdb_rating.toFixed(1)), title: "title"})
  );
}
