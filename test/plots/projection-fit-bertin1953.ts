import React from "react";
import {Plot, Frame, Geo} from "../../src/react/index.js";
import * as d3 from "d3";
import {geoBertin1953} from "d3-geo-projection";
import {merge} from "topojson-client";

export async function projectionFitBertin1953() {
  const world = await d3.json<any>("data/countries-110m.json");
  const land = merge(
    world,
    world.objects.countries.geometries.filter((d) => d.properties.name !== "Antarctica")
  );
  return React.createElement(Plot, {
      width: 960,
      height: 302,
      marginRight: 44,
      marginLeft: 0,
      facet: {data: [1, 2], x: ["a", "b"]},
      projection: {type: geoBertin1953, domain: land},
      style: "border: solid 1px blue"
    },
    React.createElement(Frame, {stroke: "red"}),
    React.createElement(Geo, {data: land, fill: "currentColor"})
  );
}
