import React from "react";
import {Plot, Cell, Text} from "../../src/react/index.js";
import * as d3 from "d3";

export async function simpsonsRatings() {
  const data = await d3.csv<any>("data/simpsons.csv", d3.autoType);
  return React.createElement(Plot, {
      grid: true,
      padding: 0.05,
      x: {
        label: "Episode",
        axis: "top"
      },
      y: {
        label: "Season"
      },
      color: {
        type: "linear",
        scheme: "PiYG",
        unknown: "#ddd"
      },
      height: 640
    },
    React.createElement(Cell, {data, x: "number_in_season", y: "season", fill: "imdb_rating"}),
    React.createElement(Text, {data, x: "number_in_season", y: "season", text: (d) => (d.imdb_rating == null ? "-" : d.imdb_rating.toFixed(1)), title: "title"})
  );
}
