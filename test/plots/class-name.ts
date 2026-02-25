import React from "react";
import {Plot, BarX, RuleX, groupY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function classNameOnMarks() {
  const sales = await d3.csv("data/fruit-sales.csv", d3.autoType);
  return React.createElement(Plot, {
      marginLeft: 50,
      y: {
        label: null,
        reverse: true
      }
    },
    React.createElement(BarX, {
      data: sales,
      ...groupY({x: "sum"}, {x: "units", y: "fruit", sort: {y: "x", reverse: true}, className: "fruit units"})
    }),
    React.createElement(RuleX, {data: [0]})
  );
}
