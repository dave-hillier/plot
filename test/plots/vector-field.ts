import React from "react";
import {Plot, Vector} from "../../src/react/index.js";
import * as d3 from "d3";

export async function vectorField() {
  return React.createElement(Plot, {
      inset: 12,
      height: 600
    },
    React.createElement(Vector, {
      data: ((T) => d3.cross(T, T))(d3.ticks(0, 2 * Math.PI, 20)),
      length: ([x, y]) => (x + y) * 2 + 2,
      rotate: ([x, y]) => (Math.sin(x) - Math.sin(y)) * 60
    })
  );
}
