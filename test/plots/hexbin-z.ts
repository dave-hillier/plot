import React from "react";
import {Plot, Hexgrid, Frame, Dot, Text, hexbin} from "../../src/react/index.js";
import * as d3 from "d3";

export async function hexbinZ() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {inset: 10, color: {legend: true}},
    React.createElement(Hexgrid),
    React.createElement(Frame),
    React.createElement(Dot, {data: penguins, ...hexbin({r: "count"}, {x: "culmen_length_mm", y: "body_mass_g", stroke: "species"})})
  );
}

export async function hexbinIdentityReduce() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {inset: 10, height: 600},
    React.createElement(Hexgrid, {binWidth: 8, strokeOpacity: 0.05}),
    React.createElement(Frame),
    React.createElement(Text, {
      data: penguins,
      ...hexbin(
        {text: "identity"},
        {x: "culmen_length_mm", y: "body_mass_g", text: (d) => d.species[0], binWidth: 8, fontSize: 7}
      )
    })
  );
}
