import React from "react";
import {Plot, Graticule, Geo, Sphere} from "../../src/react/index.js";
import * as d3 from "d3";
import {geoBerghaus} from "d3-geo-projection";
import {feature} from "topojson-client";

export async function projectionClipBerghaus() {
  const world = await d3.json<any>("data/countries-110m.json");
  const land = feature(world, world.objects.land);
  return React.createElement(Plot, {
      width: 600,
      height: 600,
      projection: {type: geoBerghaus, domain: {type: "Sphere"}}
    },
    React.createElement(Graticule, {clip: "sphere"}),
    React.createElement(Geo, {data: land, fill: "currentColor", clip: "sphere"}),
    React.createElement(Sphere, {})
  );
}
