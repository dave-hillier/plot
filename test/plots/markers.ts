import React from "react";
import {Plot, RuleX, RuleY, TickX, TickY} from "../../src/react/index.js";

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
