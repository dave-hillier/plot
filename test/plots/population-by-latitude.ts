import React from "react";
import {Plot, Geo, Graticule, Dot, Frame, dodgeX} from "../../src/react/index.js";
import * as d3 from "d3";
import {feature} from "topojson-client";

export async function populationByLatitude() {
  const world = await d3.json<any>("data/countries-110m.json");
  const land = feature(world, world.objects.land);
  const cities = await d3.csv<any>("data/cities-10k.csv", d3.autoType);
  return React.createElement(Plot, {
      style: {overflow: "visible"},
      projection: {type: "equirectangular", rotate: [-10, 0]},
      r: {range: [0, 5]}
    },
    React.createElement(Geo, {data: land, fill: "#f0f0f0"}),
    React.createElement(Graticule, {}),
    React.createElement(Dot, {data: d3.sort(cities, (d) => -d.population).slice(0, 5000), ...dodgeX({x: "longitude", y: "latitude", r: "population", fill: "currentColor"})}),
    React.createElement(Frame, {})
  );
}
