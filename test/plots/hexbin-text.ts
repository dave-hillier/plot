import React from "react";
import {Plot, Frame, Hexgrid, Dot, Text, hexbin} from "../../src/react/index.js";
import * as d3 from "d3";

export async function hexbinText() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  const xy = {fx: "sex", x: "culmen_depth_mm", y: "culmen_length_mm"};
  return React.createElement(Plot, {width: 960, height: 320, inset: 14, color: {scheme: "orrd"}},
    React.createElement(Frame),
    React.createElement(Hexgrid),
    React.createElement(Dot, {data: penguins, ...hexbin({fill: "count"}, {...xy, stroke: "currentColor", strokeWidth: 0.5})}),
    React.createElement(Text, {data: penguins, ...hexbin({text: "count"}, xy)})
  );
}
