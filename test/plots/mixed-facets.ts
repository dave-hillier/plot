import React from "react";
import {Plot, BarY, RuleY} from "../../src/react/index.js";

export async function mixedFacets() {
  const data = [
    {date: new Date("2024-01-01"), name: "a", value: 1},
    {date: new Date("2024-01-01"), name: "b", value: 2},
    {date: new Date("2024-01-01"), name: "a", value: 2},
    {date: new Date("2024-02-01"), name: "b", value: 3},
    {date: new Date("2024-02-01"), name: "a", value: 5},
    {date: new Date("2024-02-01"), name: "b", value: 2},
    {date: new Date("2024-02-01"), name: "a", value: 3}
  ];
  return React.createElement(Plot, {},
    React.createElement(BarY, {data, x: "name", y: "value", fill: "name", fx: "date", fy: "name"}),
    React.createElement(BarY, {data, x: "name", y: "value", fx: "date", stroke: "currentColor"}),
    React.createElement(RuleY, {data: [0]})
  );
}
