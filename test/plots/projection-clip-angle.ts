import React from "react";
import {Plot, Graticule, Geo, Sphere} from "../../src/react/index.js";
import * as d3 from "d3";
import {feature} from "topojson-client";

export async function projectionClipAngle() {
  const world = await d3.json<any>("data/countries-50m.json");
  const domain = feature(world, world.objects.land);
  return React.createElement(Plot, {
      width: 600,
      height: 600,
      projection: {type: "azimuthal-equidistant", clip: 30, rotate: [0, 89.9], domain: {type: "Sphere"}}
    },
    React.createElement(Graticule, {}),
    React.createElement(Geo, {data: domain, fill: "currentColor"}),
    React.createElement(Sphere, {})
  );
}
