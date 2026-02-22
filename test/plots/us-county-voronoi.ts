import React from "react";
import {Plot, Voronoi, VoronoiMesh, geoCentroid, centroid} from "../../src/react/index.js";
import * as d3 from "d3";
import {feature} from "topojson-client";

const transform = (data, facets) => ({data, facets: facets.map((I) => I.slice(1))});

export async function usCountyVoronoi() {
  const counties = await d3
    .json<any>("data/us-counties-10m.json")
    .then((us) => feature(us, us.objects.counties).features);
  return React.createElement(Plot, {projection: "albers"},
    React.createElement(Voronoi, {data: counties, ...geoCentroid({transform, stroke: "red"})}),
    React.createElement(Voronoi, {data: counties, ...centroid({transform, stroke: "blue", mixBlendMode: "multiply"})})
  );
}

export async function usCountyVoronoiMesh() {
  const counties = await d3
    .json<any>("data/us-counties-10m.json")
    .then((us) => feature(us, us.objects.counties).features);
  return React.createElement(Plot, {projection: "albers"},
    React.createElement(VoronoiMesh, {data: counties, ...geoCentroid({transform, stroke: "red", strokeOpacity: 1})}),
    React.createElement(VoronoiMesh, {data: counties, ...centroid({transform, stroke: "blue", strokeOpacity: 1, mixBlendMode: "multiply"})})
  );
}
