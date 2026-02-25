import React from "react";
import {Plot, Geo, Rect, Arrow, Sphere} from "../../src/react/index.js";
import * as d3 from "d3";
import {geoChamberlinAfrica} from "d3-geo-projection";
import {feature} from "topojson-client";

export async function boundingBoxes() {
  const world = await d3.json<any>("data/countries-110m.json");
  const land = feature(world, world.objects.land);
  const countries = feature(world, world.objects.countries).features;
  return React.createElement(Plot, {
      width: 600,
      height: 600,
      projection: {
        type: geoChamberlinAfrica,
        domain: {
          type: "MultiPoint",
          coordinates: [
            [-20, 0],
            [55, 0]
          ]
        }
      }
    },
    React.createElement(Geo, {data: land}),
    React.createElement(Rect, {
      data: countries,
      transform: (data, facets) => ({
        data: data.map((c) => d3.geoBounds(c).flat()), // returns [x1, y1, x2, y2]
        facets
      }),
      x1: "0",
      y1: "1",
      x2: "2",
      y2: "3",
      stroke: "green"
    }),
    React.createElement(Arrow, {data: [1], x1: -10, y1: 10, x2: 20, y2: -32, bend: true, stroke: "red"}),
    React.createElement(Sphere, {})
  );
}
