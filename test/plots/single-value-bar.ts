import React from "react";
import {Plot, BarY, RuleX} from "../../src/react/index.js";

export async function singleValueBar() {
  return React.createElement(Plot, {},
    React.createElement(BarY, {data: {length: 1}, x: ["foo"], y1: [0], y2: [0]}),
    React.createElement(RuleX, {data: ["foo"], stroke: "red", y1: [0], y2: [0]})
  );
}
