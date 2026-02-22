import React from "react";
import {Plot, Voronoi, Dot, VoronoiMesh} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinVoronoi1D() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {inset: 10},
    React.createElement(Voronoi, {
      data: penguins,
      x: "body_mass_g",
      fill: "species",
      fillOpacity: 0.5,
      href: (d) => `https://en.wikipedia.org/wiki/${d.species}_penguin`,
      target: "_blank",
      title: (d) => `${d.species} (${d.sex})\n${d.island}`
    }),
    React.createElement(Dot, {
      data: penguins,
      x: "body_mass_g",
      fill: "currentColor",
      r: 1.5,
      pointerEvents: "none"
    }),
    React.createElement(VoronoiMesh, {
      data: penguins,
      x: "body_mass_g",
      pointerEvents: "none"
    })
  );
}
