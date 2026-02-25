import React from "react";
import {Plot, Frame, Circle, hexbin} from "../../src/react/index.js";
import * as d3 from "d3";

export async function hexbinOranges() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {inset: 10, color: {scheme: "oranges"}},
    React.createElement(Frame),
    React.createElement(Circle, {data: penguins, ...hexbin({fill: "count"}, {x: "culmen_depth_mm", y: "culmen_length_mm"})})
  );
}
