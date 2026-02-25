import React from "react";
import {Plot, Hexgrid, Frame, Circle, hexbin} from "../../src/react/index.js";
import * as d3 from "d3";

export async function hexbinZNull() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {inset: 10},
    React.createElement(Hexgrid),
    React.createElement(Frame),
    React.createElement(Circle, {
      data: penguins,
      ...hexbin(
        {r: "count", stroke: "mode", fill: "mode"},
        {x: "culmen_depth_mm", y: "culmen_length_mm", z: null, fill: "island", stroke: "species"}
      )
    })
  );
}
