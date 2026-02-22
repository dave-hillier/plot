import React from "react";
import {Plot, BarY} from "../../src/react/index.js";

export async function emptyFacet() {
  const data = [
    {PERIOD: 1, VALUE: 3, TYPE: "c"},
    {PERIOD: 2, VALUE: 4, TYPE: "c"}
  ];
  return React.createElement(Plot, {
      facet: {data, x: "TYPE"},
      fx: {domain: ["a", "b"]}
    },
    React.createElement(BarY, {data, x: "PERIOD", y: "VALUE"})
  );
}
