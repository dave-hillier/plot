import React from "react";
import {Plot, Geo, Graticule} from "../../src/react/index.js";
import * as d3 from "d3";
import {feature} from "topojson-client";

export async function projectionNull() {
  const world = await d3.json<any>("data/countries-110m.json");
  const land = feature(world, world.objects.land);
  return React.createElement(Plot, {
      projection: null
    },
    React.createElement(Geo, {data: land}),
    React.createElement(Graticule, {})
  );
}
