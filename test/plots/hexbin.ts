import React from "react";
import {Plot, Hexgrid, Frame, Dot, hexbin as hexbinTransform} from "../../src/react/index.js";
import * as d3 from "d3";

export async function hexbin() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Hexgrid),
    React.createElement(Frame),
    React.createElement(Dot, {data: penguins, ...hexbinTransform({r: "count"}, {x: "culmen_depth_mm", y: "culmen_length_mm"})})
  );
}

export async function hexbinFillX() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Hexgrid),
    React.createElement(Frame),
    React.createElement(Dot, {data: penguins, ...hexbinTransform({r: "count", fill: "x"}, {x: "culmen_depth_mm", y: "culmen_length_mm"})})
  );
}
