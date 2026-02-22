import React from "react";
import {Plot, Frame, Dot, Text, GridX, GridY, AxisX, AxisY, AxisFx} from "../../src/react/index.js";
import * as d3 from "d3";

export async function frameFillCategorical() {
  return React.createElement(Plot, {color: {legend: true}},
    React.createElement(Frame, {fill: "foo"}), // abstract color
    React.createElement(Frame, {fill: "bar", inset: 5}), // abstract color
    React.createElement(Frame, {fill: "baz", inset: 10}), // abstract color
    React.createElement(Frame, {fill: "white", inset: 15}) // literal color
  );
}

export async function frameFillQuantitative() {
  return React.createElement(Plot, {color: {type: "linear", legend: true}},
    d3.range(11).map((t, i) => React.createElement(Frame, {key: i, fill: t, inset: i})), // abstract color
    React.createElement(Frame, {fill: "white", inset: 11}) // literal color
  );
}

export async function frameFacet() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {marginLeft: 80, inset: 10},
    React.createElement(Frame, {fy: "Gentoo"}),
    React.createElement(Dot, {data: penguins, x: "body_mass_g", fy: "species"})
  );
}

export async function frameCorners() {
  return React.createElement(Plot, {},
    React.createElement(Frame, {rx: 16, ry: 10})
  );
}

const marks = [
  React.createElement(Frame, {key: "left", anchor: "left", stroke: "red", strokeWidth: 4}),
  React.createElement(Frame, {key: "right", anchor: "right", stroke: "green", strokeWidth: 4}),
  React.createElement(Frame, {key: "top", anchor: "top", stroke: "blue", strokeWidth: 4}),
  React.createElement(Frame, {key: "bottom", anchor: "bottom", stroke: "black", strokeWidth: 4})
];

export async function frameSides() {
  return React.createElement(Plot, {width: 350, height: 250, margin: 2}, ...marks);
}

export async function frameSidesXY() {
  return React.createElement(Plot, {width: 350, height: 250, x: {domain: [0, 1]}, y: {domain: [0, 1]}}, ...marks);
}

export async function frameSidesX() {
  return React.createElement(Plot, {width: 350, height: 250, x: {domain: [0, 1]}}, ...marks);
}

export async function frameSidesY() {
  return React.createElement(Plot, {width: 350, height: 250, y: {domain: [0, 1]}}, ...marks);
}

export async function futureSplom() {
  const data = {columns: ["A", "B", "C"]};
  return React.createElement(Plot, {
      width: 400,
      height: 400,
      fx: {domain: data.columns, axis: null},
      fy: {domain: data.columns, axis: null},
      x: {type: "linear", domain: [-1.5, 1.5]},
      y: {type: "linear", domain: [-1.5, 1.5]}
    },
    React.createElement(GridX, {ticks: 7}),
    React.createElement(GridY, {ticks: 7}),
    React.createElement(AxisX, {facetAnchor: "bottom", ticks: 3}),
    React.createElement(AxisY, {facetAnchor: "left", ticks: 3}),
    React.createElement(Text, {
      data: d3.cross(data.columns, data.columns).filter(([key1, key2]) => key2 !== key1),
      fx: "0", fy: "1", text: () => "*", frameAnchor: "middle"
    }),
    React.createElement(AxisFx, {label: null, frameAnchor: "middle", dy: 10, facetAnchor: "empty"}),
    React.createElement(Frame, {facetAnchor: "empty"})
  );
}
