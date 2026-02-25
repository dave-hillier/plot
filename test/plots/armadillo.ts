import React from "react";
import {Plot, Geo, Graticule, Sphere} from "../../src/react/index.js";
import * as d3 from "d3";
import {geoArmadillo} from "d3-geo-projection";
import {feature} from "topojson-client";

export async function armadillo() {
  const world = await d3.json<any>("data/countries-50m.json");
  const land = feature(world, world.objects.land);
  return React.createElement(Plot, {
      width: 960,
      height: 548,
      margin: 1,
      projection: ({width, height}) => geoArmadillo().precision(0.2).fitSize([width, height], {type: "Sphere"})
    },
    React.createElement(Geo, {data: land, clip: "sphere", fill: "currentColor"}),
    React.createElement(Graticule, {clip: {type: "Sphere"}}),
    React.createElement(Sphere, {})
  );
}
