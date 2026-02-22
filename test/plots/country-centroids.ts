import React from "react";
import {Plot, Graticule, Geo, Text, Frame, geoCentroid, centroid} from "../../src/react/index.js";
import * as d3 from "d3";
import {feature} from "topojson-client";

export async function countryCentroids() {
  const world = await d3.json<any>("data/countries-110m.json");
  const land = feature(world, world.objects.land);
  const countries = feature(world, world.objects.countries);
  return React.createElement(Plot, {projection: "mercator"},
    React.createElement(Graticule, {}),
    React.createElement(Geo, {data: land, fill: "#ddd"}),
    React.createElement(Geo, {data: countries, stroke: "#fff"}),
    React.createElement(Text, {data: countries, ...geoCentroid({fill: "red", text: "id"})}),
    React.createElement(Text, {data: countries, ...centroid({fill: "blue", text: "id"})}),
    React.createElement(Frame, {})
  );
}
