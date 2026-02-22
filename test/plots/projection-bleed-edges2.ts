import React from "react";
import {Plot, Graticule, Geo, Frame} from "../../src/react/index.js";
import * as d3 from "d3";
import {feature} from "topojson-client";

export async function projectionBleedEdges2() {
  const world = await d3.json<any>("data/countries-110m.json");
  const land = feature(world, world.objects.land);
  return React.createElement(Plot, {
      width: 600,
      height: 600,
      facet: {x: [1, 2], data: [1, 2]},
      projection: {
        type: "azimuthal-equidistant",
        rotate: [90, -90],
        domain: d3.geoCircle().center([0, 90]).radius(85)(),
        clip: "frame",
        inset: -185
      }
    },
    React.createElement(Graticule, {}),
    React.createElement(Geo, {data: land, fill: "#ccc", stroke: "currentColor"}),
    React.createElement(Frame, {stroke: "white"})
  );
}
