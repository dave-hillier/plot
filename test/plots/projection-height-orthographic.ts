import React from "react";
import {Plot, Geo, Graticule, Sphere, Frame} from "../../src/react/index.js";
import * as d3 from "d3";
import {feature} from "topojson-client";

export async function projectionHeightOrthographic() {
  const world = await d3.json<any>("data/countries-110m.json");
  const land = feature(world, world.objects.land);
  return React.createElement(Plot, {
      facet: {data: [0, 1, 2, 3], x: (d) => d % 2, y: (d) => d >> 1},
      projection: "orthographic"
    },
    React.createElement(Geo, {data: land, fill: "currentColor"}),
    React.createElement(Graticule, {}),
    React.createElement(Sphere, {}),
    React.createElement(Frame, {stroke: "red", strokeDasharray: 4})
  );
}
