import React from "react";
import {Plot, AreaY, LineY, RuleY, AxisY, normalizeY, valueof} from "../../src/react/index.js";
import * as d3 from "d3";

export async function aaplClose() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {y: {grid: true}},
    React.createElement(AreaY, {data: aapl, x: "Date", y: "Close", fillOpacity: 0.1}),
    React.createElement(LineY, {data: aapl, x: "Date", y: "Close"}),
    React.createElement(RuleY, {data: [0]})
  );
}

export async function aaplCloseClip() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {
      clip: true,
      x: {domain: [new Date(Date.UTC(2015, 0, 1)), new Date(Date.UTC(2015, 3, 1))]},
      y: {grid: true}
    },
    React.createElement(AreaY, {data: aapl, x: "Date", y: "Close", fillOpacity: 0.1}),
    React.createElement(LineY, {data: aapl, x: "Date", y: "Close"}),
    React.createElement(RuleY, {data: [0], clip: false})
  );
}

export async function aaplCloseDataTicks() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(AxisY, {data: d3.ticks(0, 200, 10), anchor: "left"}),
    React.createElement(LineY, {data: aapl, x: "Date", y: "Close"})
  );
}

export async function aaplCloseImplicitGrid() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {y: {grid: true}},
    React.createElement(AxisY, {anchor: "left"}),
    React.createElement(LineY, {data: aapl, x: "Date", y: "Close"})
  );
}

export async function aaplCloseGridColor() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {y: {grid: "red"}},
    React.createElement(LineY, {data: aapl, x: "Date", y: "Close"})
  );
}

export async function aaplCloseGridInterval() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {x: {grid: "3 months"}},
    React.createElement(LineY, {data: aapl, x: "Date", y: "Close"})
  );
}

export async function aaplCloseGridIntervalName() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {x: {grid: "month"}},
    React.createElement(LineY, {data: aapl, x: "Date", y: "Close"})
  );
}

export async function aaplCloseGridIterable() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {y: {grid: [100, 120, 140]}},
    React.createElement(LineY, {data: aapl, x: "Date", y: "Close"})
  );
}

export async function aaplCloseNormalize() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  const x = new Date("2014-01-01");
  const X = valueof(aapl, "Date");
  return React.createElement(Plot, {
      y: {type: "log", grid: true, tickFormat: ".1f"}
    },
    React.createElement(RuleY, {data: [1]}),
    React.createElement(LineY, {
      data: aapl,
      ...normalizeY((I, Y) => Y[I.find((i) => X[i] >= x)], {x: X, y: "Close"})
    })
  );
}
