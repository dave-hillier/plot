import React from "react";
import {Plot, Rect, bin} from "../../src/react/index.js";
import * as d3 from "d3";

export async function diamondsCaratPrice() {
  const data = await d3.csv<any>("data/diamonds.csv", d3.autoType);
  return React.createElement(Plot, {
      height: 640,
      marginLeft: 44,
      color: {
        scheme: "bupu",
        type: "symlog"
      }
    },
    React.createElement(Rect, {data, ...bin({fill: "count"}, {x: "carat", y: "price", thresholds: 100})})
  );
}
