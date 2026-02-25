import React from "react";
import {Plot, Geo, Dot, VoronoiMesh, Voronoi, Sphere, pointer, centroid, geoCentroid} from "../../src/react/index.js";
import * as d3 from "d3";
import {feature} from "topojson-client";

export async function usStateCapitalsVoronoi() {
  const [capitals, nation] = await Promise.all([
    d3.csv<any>("data/us-state-capitals.csv", d3.autoType),
    d3.json<any>("data/us-counties-10m.json").then((us) => feature(us, us.objects.nation))
  ]);
  return React.createElement(Plot, {
      width: 640,
      height: 640,
      margin: 1,
      projection: ({width, height}) =>
        d3.geoAzimuthalEqualArea().rotate([96, -40]).clipAngle(24).fitSize([width, height], {type: "Sphere"})
    },
    React.createElement(Geo, {data: nation, fill: "currentColor", fillOpacity: 0.2}),
    React.createElement(Dot, {data: capitals, x: "longitude", y: "latitude", r: 2.5, fill: "currentColor"}),
    React.createElement(VoronoiMesh, {data: capitals, x: "longitude", y: "latitude", clip: "sphere"}),
    React.createElement(Voronoi, {
      data: capitals,
      ...pointer({
        x: "longitude",
        y: "latitude",
        clip: "sphere",
        title: "state",
        stroke: "red",
        fill: "red",
        fillOpacity: 0.4,
        pointerEvents: "all",
        maxRadius: Infinity
      })
    }),
    React.createElement(Sphere, {strokeWidth: 2})
  );
}

async function voronoiMap(centroidFn, clipNation = false) {
  const [nation, states] = await d3
    .json<any>("data/us-counties-10m.json")
    .then((us) => [feature(us, us.objects.nation), feature(us, us.objects.states)]);

  const clip = clipNation ? nation : "sphere";
  return React.createElement(Plot, {
      width: 640,
      height: 640,
      margin: 1,
      projection: ({width, height}) =>
        d3
          .geoAzimuthalEqualArea()
          .rotate([96, -40])
          .clipAngle(24)
          .fitSize([width, height], clipNation ? nation : {type: "Sphere"})
    },
    React.createElement(Geo, {data: nation, fill: "currentColor", fillOpacity: 0.2}),
    React.createElement(Dot, {data: states.features, ...centroidFn({r: 2.5, fill: "currentColor"})}),
    React.createElement(VoronoiMesh, {data: states.features, ...centroidFn({clip})}),
    React.createElement(Voronoi, {
      data: states.features,
      ...pointer(
        centroidFn({
          x: "longitude",
          y: "latitude",
          title: "state",
          stroke: "red",
          fill: "red",
          fillOpacity: 0.4,
          pointerEvents: "all",
          maxRadius: Infinity,
          clip
        })
      )
    }),
    clipNation
      ? React.createElement(Geo, {data: nation, strokeWidth: 1})
      : React.createElement(Sphere, {strokeWidth: 2})
  );
}

export async function usStateCentroidVoronoi() {
  return voronoiMap(centroid);
}

export async function usStateClipVoronoi() {
  return voronoiMap(centroid, true);
}

export async function usStateGeoCentroidVoronoi() {
  return voronoiMap(geoCentroid);
}
