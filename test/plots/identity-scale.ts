import React from "react";
import {Plot, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function identityScale() {
  const random = d3.randomLcg(42);
  return React.createElement(Plot, {
      x: {type: "identity"},
      y: {type: "identity"},
      color: {type: "identity"}
    },
    React.createElement(Dot, {
      data: {length: 100},
      x: () => 600 * random(),
      y: () => 100 + 500 * random(),
      fill: () => "red",
      stroke: () => "blue"
    })
  );
}
