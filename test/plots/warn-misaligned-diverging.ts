import React from "react";
import {Plot, CellX, identity} from "../../src/react/index.js";
import * as d3 from "d3";

export function warnMisalignedDivergingDomain() {
  return React.createElement(Plot, {color: {legend: true, type: "diverging", domain: [-5, 5, 10]}},
    React.createElement(CellX, {data: d3.range(-5, 6), x: identity, fill: identity})
  );
}
