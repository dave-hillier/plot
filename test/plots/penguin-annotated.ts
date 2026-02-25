import React from "react";
import {Plot, BarX, Frame, Text, groupY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinAnnotated() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      marginLeft: 75,
      x: {insetRight: 10}
    },
    React.createElement(BarX, {data: penguins, ...groupY({x: "count"}, {y: "species", fill: "sex", title: "sex", sort: {y: "-x"}})}),
    React.createElement(Frame, {}),
    React.createElement(Text, {
      data: ["Count of penguins\ngrouped by species\n and colored by sex"],
      frameAnchor: "bottom-right",
      dx: -3,
      dy: -3,
      fontStyle: "italic"
    })
  );
}
