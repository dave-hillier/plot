import React from "react";
import {Plot, Geo, Frame} from "../../src/react/index.js";
import * as d3 from "d3";
import {mesh} from "topojson-client";

export async function projectionHeightAlbers() {
  const [conus, countymesh] = await d3
    .json<any>("data/us-counties-10m.json")
    .then((us) => [mesh(us, us.objects.states, (a, b) => a === b), mesh(us, us.objects.counties, (a, b) => a !== b)]);
  return React.createElement(Plot, {
      projection: {
        type: "albers-usa"
      }
    },
    React.createElement(Geo, {data: conus, strokeWidth: 1.5}),
    React.createElement(Geo, {data: countymesh, strokeOpacity: 0.1}),
    React.createElement(Frame, {stroke: "red", strokeDasharray: 4})
  );
}
