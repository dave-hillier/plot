import React from "react";
import {Plot, CellX, identity} from "../../src/react/index.js";
import * as d3 from "d3";

export function colorPiecewiseLinearDomain() {
  return React.createElement(Plot, {
      color: {legend: true, type: "linear", domain: [0, 10, 20], range: ["red", "blue"]}
    },
    React.createElement(CellX, {data: d3.range(11), fill: identity})
  );
}

export function colorPiecewiseLinearDomainReverse() {
  return React.createElement(Plot, {
      color: {legend: true, type: "linear", domain: [0, 10, 20], reverse: true, range: ["red", "blue"]}
    },
    React.createElement(CellX, {data: d3.range(11), fill: identity})
  );
}

export function colorPiecewiseLinearRange() {
  return React.createElement(Plot, {
      color: {legend: true, type: "linear", domain: [0, 10], range: ["red", "blue", "green"]}
    },
    React.createElement(CellX, {data: d3.range(11), fill: identity})
  );
}

export function colorPiecewiseLinearRangeHcl() {
  return React.createElement(Plot, {
      color: {legend: true, type: "linear", domain: [0, 10], range: ["red", "blue", "green"], interpolate: "hcl"}
    },
    React.createElement(CellX, {data: d3.range(11), fill: identity})
  );
}

export function colorPiecewiseLinearRangeReverse() {
  return React.createElement(Plot, {
      color: {legend: true, type: "linear", domain: [0, 10], reverse: true, range: ["red", "blue", "green"]}
    },
    React.createElement(CellX, {data: d3.range(11), fill: identity})
  );
}
