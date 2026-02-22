import React from "react";
import {Plot, DotX, indexOf} from "../../src/react/index.js";

export async function symbolSetFill() {
  return React.createElement(Plot, {},
    React.createElement(DotX, {data: ["circle", "cross", "diamond", "square", "star", "triangle", "wye"], fill: "currentColor", symbol: indexOf})
  );
}

export async function symbolSetStroke() {
  return React.createElement(Plot, {},
    React.createElement(DotX, {data: ["circle", "cross", "diamond", "square", "star", "triangle", "wye"], stroke: "currentColor", symbol: indexOf})
  );
}

export async function symbolSetFillColor() {
  return React.createElement(Plot, {symbol: {legend: true}},
    React.createElement(DotX, {data: ["circle", "cross", "diamond", "square", "star", "triangle", "wye"], fill: indexOf, symbol: indexOf})
  );
}

export async function symbolSetStrokeColor() {
  return React.createElement(Plot, {symbol: {legend: true}},
    React.createElement(DotX, {data: ["circle", "cross", "diamond", "square", "star", "triangle", "wye"], stroke: indexOf, symbol: indexOf})
  );
}
