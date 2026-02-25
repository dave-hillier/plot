import React from "react";
import {Plot, RuleY, Line, Text, normalizeY, selectLast} from "../../src/react/index.js";
import * as d3 from "d3";

const format = d3.format("+d");

function formatChange(x) {
  return format((x - 1) * 100);
}

async function loadSymbol(name) {
  const Symbol = name.toUpperCase();
  return d3.csv(`data/${name}.csv`, (d) => ({Symbol, ...d3.autoType(d)}));
}

export async function stocksIndex() {
  const stocks = (await Promise.all(["aapl", "amzn", "goog", "ibm"].map(loadSymbol))).flat();
  return React.createElement(Plot, {
      style: "overflow: visible;",
      y: {
        type: "log",
        grid: true,
        label: "Change in price (%)",
        tickFormat: formatChange
      }
    },
    React.createElement(RuleY, {data: [1]}),
    React.createElement(Line, {
      data: stocks,
      ...normalizeY({
        x: "Date",
        y: "Close",
        stroke: "Symbol"
      })
    }),
    React.createElement(Text, {
      data: stocks,
      ...selectLast(
        normalizeY({
          x: "Date",
          y: "Close",
          z: "Symbol",
          text: (d) => d.Symbol.toUpperCase(),
          textAnchor: "start",
          dx: 3
        })
      )
    })
  );
}
