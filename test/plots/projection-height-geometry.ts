import React from "react";
import {Plot, Geo, Frame, Graticule, Sphere} from "../../src/react/index.js";

const shape = {
  type: "LineString",
  coordinates: Array.from({length: 201}, (_, i) => {
    const angle = (i / 100) * Math.PI;
    const r = (i % 2) + 5;
    return [300 + 30 * r * Math.cos(angle), 185 + 30 * r * Math.sin(angle)];
  })
} as const;

export async function projectionHeightGeometry() {
  return React.createElement(Plot, {
      facet: {data: [0, 1], y: [0, 1]},
      projection: "identity"
    },
    React.createElement(Geo, {data: shape}),
    React.createElement(Frame, {stroke: "red", strokeDasharray: 4})
  );
}

export async function projectionHeightDegenerate() {
  return React.createElement(Plot, {
      style: "border: #777 1px solid;",
      projection: "mercator",
      height: 400,
      inset: 199.5
    },
    React.createElement(Graticule, {}),
    React.createElement(Sphere, {})
  );
}

export async function projectionHeightGeometryDomain() {
  return React.createElement(Plot, {
      projection: {type: "identity", domain: shape}
    },
    React.createElement(Geo, {data: shape}),
    React.createElement(Frame, {stroke: "red", strokeDasharray: 4})
  );
}

export async function projectionHeightGeometryNull() {
  return React.createElement(Plot, {
      aspectRatio: true,
      width: 400,
      facet: {data: [0, 1], y: [0, 1]}
    },
    React.createElement(Geo, {data: shape}),
    React.createElement(Frame, {stroke: "red", strokeDasharray: 4})
  );
}
