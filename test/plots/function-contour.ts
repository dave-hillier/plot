import React from "react";
import {Plot, Contour, Frame} from "../../src/react/index.js";
import * as d3 from "d3";

export async function functionContour() {
  return React.createElement(Plot, {color: {type: "diverging"}},
    React.createElement(Contour, {
      fill: (x, y) => x * y * Math.sin(x) * Math.cos(y),
      stroke: "currentColor",
      x1: 0,
      y1: 0,
      x2: 4 * Math.PI,
      y2: 4 * Math.PI * (350 / 580),
      thresholds: d3.ticks(-80, 50, 10) // testing explicit thresholds
    })
  );
}

export async function functionContourFaceted() {
  function lin(x) {
    return x / (4 * Math.PI);
  }
  return React.createElement(Plot, {
      height: 580,
      color: {type: "diverging"},
      fx: {tickFormat: (f) => f?.name},
      fy: {tickFormat: (f) => f?.name}
    },
    React.createElement(Contour, {
      data: undefined,
      fill: (x, y, {fx, fy}) => fx(x) * fy(y),
      fx: [Math.sin, Math.sin, lin, lin],
      fy: [Math.cos, lin, lin, Math.cos],
      x1: 0,
      y1: 0,
      x2: 4 * Math.PI,
      y2: 4 * Math.PI,
      interval: 0.2
    }),
    React.createElement(Frame)
  );
}

export async function functionContourFaceted2() {
  function lin(x) {
    return x / (4 * Math.PI);
  }
  return React.createElement(Plot, {
      height: 580,
      color: {type: "diverging"},
      fx: {tickFormat: (f) => f?.name},
      fy: {tickFormat: (f) => f?.name}
    },
    React.createElement(Contour, {
      fill: (x, y, {fx, fy}) => fx(x) * fy(y),
      fx: [Math.sin, Math.sin, lin, lin],
      fy: [Math.cos, lin, lin, Math.cos],
      x1: 0,
      y1: 0,
      x2: 4 * Math.PI,
      y2: 4 * Math.PI,
      thresholds: 10
    }),
    React.createElement(Frame)
  );
}
