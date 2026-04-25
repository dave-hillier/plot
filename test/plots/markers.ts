import React from "react";
import {Plot, RuleX, RuleY, TickX, TickY, LineY} from "../../src/react/index.js";

export async function markerDasharray() {
  return React.createElement(Plot, {axis: null, inset: 20},
    React.createElement(LineY, {
      data: [
        [0, 5],
        [5, 2],
        [10, 0]
      ],
      x: (d: number[]) => d[0],
      y: (d: number[]) => d[1],
      strokeDasharray: "1,10",
      strokeWidth: 3,
      markerStart: "dot",
      markerMid: "arrow",
      markerEnd: "circle-stroke"
    })
  );
}

export async function markerRuleX() {
  return React.createElement(Plot, {},
    React.createElement(RuleX, {data: [1, 2, 3], marker: "arrow-reverse", inset: 3})
  );
}

export async function markerRuleY() {
  return React.createElement(Plot, {},
    React.createElement(RuleY, {data: [1, 2, 3], marker: "arrow-reverse", inset: 3})
  );
}

export async function markerTickX() {
  return React.createElement(Plot, {},
    React.createElement(TickX, {data: [1, 2, 3], marker: "arrow-reverse", inset: 3})
  );
}

export async function markerTickY() {
  return React.createElement(Plot, {},
    React.createElement(TickY, {data: [1, 2, 3], marker: "arrow-reverse", inset: 3})
  );
}
