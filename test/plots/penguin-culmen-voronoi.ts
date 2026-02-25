import React from "react";
import {Plot, Dot, Voronoi, VoronoiMesh, Frame, pointer, hexbin} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinCulmenVoronoi() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Dot, {data: penguins, x: "culmen_depth_mm", y: "culmen_length_mm", fill: "currentColor", r: 1.5}),
    React.createElement(Voronoi, {data: penguins, x: "culmen_depth_mm", y: "culmen_length_mm", stroke: "species", tip: true})
  );
}

export async function penguinCulmenVoronoiExclude() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  const xy = {fx: "species", x: "culmen_depth_mm", y: "culmen_length_mm"};
  return React.createElement(Plot, {inset: 10},
    React.createElement(Frame, {}),
    React.createElement(Dot, {data: penguins, ...xy, facet: "exclude", fill: "currentColor", r: 1.5}),
    React.createElement(Dot, {data: penguins, ...xy, facet: "include", fillOpacity: 0.25, fill: "currentColor", r: 1.5}),
    React.createElement(VoronoiMesh, {data: penguins, ...xy, facet: "exclude"}),
    React.createElement(Voronoi, {
      data: penguins,
      ...pointer({
        ...xy,
        facet: "exclude",
        stroke: "species",
        fill: "species",
        fillOpacity: 0.2,
        maxRadius: Infinity
      })
    })
  );
}

export async function penguinCulmenVoronoiExcludeHex() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  const xy = {fx: "species", x: "culmen_depth_mm", y: "culmen_length_mm"};
  return React.createElement(Plot, {inset: 20},
    React.createElement(Frame, {}),
    React.createElement(Dot, {data: penguins, ...hexbin({}, {...xy, facet: "exclude", stroke: "species", fill: "species"})}),
    React.createElement(VoronoiMesh, {data: penguins, ...hexbin({}, {...xy, facet: "exclude", strokeOpacity: 1})}),
    React.createElement(Voronoi, {
      data: penguins,
      ...pointer(hexbin({}, {...xy, facet: "exclude", strokeWidth: 2, maxRadius: Infinity}))
    })
  );
}
