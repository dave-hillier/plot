import React from "react";
import {Plot, Dot, GridX, GridY, AxisX, AxisY} from "../../src/react/index.js";

export async function axisFilter() {
  return React.createElement(Plot, {height: 100},
    React.createElement(Dot, {data: [
      ["A", 0],
      ["B", 2],
      [0, 1]
    ]}),
    React.createElement(GridX, {filter: (d) => d}),
    React.createElement(GridY, {filter: (d) => d}),
    React.createElement(AxisX, {filter: (d) => d}),
    React.createElement(AxisY, {filter: (d) => d})
  );
}
