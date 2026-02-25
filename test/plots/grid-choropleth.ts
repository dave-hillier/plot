import React from "react";
import {Plot, Cell, Text, Rect, groupY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function gridChoropleth() {
  const [grid, data] = await Promise.all([
    await d3.csv<any>("data/us-state-grid.csv", d3.autoType).then(gridmap),
    await d3.csv<any>("data/us-state-population-2010-2019.csv", d3.autoType)
  ]);
  const states = data.filter((d) => grid.has(d.State)).map((d) => ({...d, ...grid.get(d.State)}));
  return React.createElement(Plot, {
      height: 420,
      x: {axis: null},
      y: {axis: null},
      color: {type: "diverging-log", scheme: "piyg"}
    },
    React.createElement(Cell, {data: states, x: "x", y: "y", fill: change}),
    React.createElement(Text, {data: states, x: "x", y: "y", text: "key", dy: -6}),
    React.createElement(Text, {
      data: states,
      x: "x",
      y: "y",
      text: (
        (f) => (d) =>
          f(change(d) - 1)
      )(d3.format("+.0%")),
      dy: 6,
      fillOpacity: 0.6
    })
  );
}

export async function gridChoroplethDx() {
  const [grid, data] = await Promise.all([
    await d3.csv<any>("data/us-state-grid.csv", d3.autoType).then(gridmap),
    await d3.csv<any>("data/us-state-population-2010-2019.csv", d3.autoType)
  ]);
  const states = data.filter((d) => grid.has(d.State)).map((d) => ({...d, ...grid.get(d.State)}));
  return React.createElement(Plot, {
      height: 420,
      x: {axis: null},
      y: {axis: null},
      color: {type: "diverging-log", scheme: "piyg"}
    },
    React.createElement(Cell, {data: states, x: "x", y: "y", fill: change, dx: -1.5, dy: -1.5}),
    React.createElement(Cell, {data: states, x: "x", y: "y", stroke: "black", dx: 1.5, dy: 1.5}),
    React.createElement(Text, {data: states, x: "x", y: "y", text: "key", dy: -6}),
    React.createElement(Text, {
      data: states,
      x: "x",
      y: "y",
      text: (
        (f) => (d) =>
          f(change(d) - 1)
      )(d3.format("+.0%")),
      dy: 6,
      fillOpacity: 0.6
    })
  );
}

export async function gridReduceIdentity() {
  const grid = await d3.csv<any>("data/us-state-grid.csv", d3.autoType);
  return React.createElement(Plot, {
      axis: null,
      x: {insetRight: 200},
      y: {reverse: true},
      aspectRatio: true
    },
    React.createElement(Rect, {data: grid, x: "x", y: "y", stroke: "currentColor", interval: 1, inset: 3}),
    React.createElement(Text, {
      data: grid,
      ...groupY(
        {y: ([y]) => y + 0.5, text: "identity"},
        {sort: "x", frameAnchor: "right", y: "y", text: "key", dx: -10, stroke: "white", fill: "currentColor"}
      )
    })
  );
}

function gridmap(states: {name: string}[]) {
  return new Map(states.map((state) => [state.name, state]));
}

function change(d) {
  return d["2019"] / d["2010"];
}
