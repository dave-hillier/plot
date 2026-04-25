import React from "react";
import {Plot, CellX, identity} from "../../src/react/index.js";
import * as d3 from "d3";

export async function ordinalOpacity() {
  return React.createElement(Plot, {opacity: {type: "ordinal"}},
    React.createElement(CellX, {data: d3.range(10), fill: "red", opacity: identity})
  );
}

export async function ordinalOpacityImplicitZero() {
  return React.createElement(Plot, {opacity: {type: "ordinal"}},
    React.createElement(CellX, {data: d3.range(2, 10), fill: "red", opacity: identity})
  );
}

export async function ordinalOpacityRamp() {
  return React.createElement(Plot, {opacity: {type: "ordinal", legend: "ramp"}},
    React.createElement(CellX, {data: d3.range(10), fill: "red", opacity: identity})
  );
}

export async function ordinalOpacityThreshold() {
  return React.createElement(Plot, {opacity: {type: "threshold", legend: true, domain: [2, 5, 8], range: [0.2, 0.4, 0.6, 0.8]}},
    React.createElement(CellX, {data: d3.range(10), fill: "red", opacity: identity})
  );
}
