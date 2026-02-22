import React from "react";
import {Plot, BarY, RuleY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinSex() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(BarY, {data: penguins, ...groupX({y: "count"}, {x: "sex"})}),
    React.createElement(RuleY, {data: [0]})
  );
}
