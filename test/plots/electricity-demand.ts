import React from "react";
import {Plot, Frame, RuleY, AxisX, GridX, Dot, Line, windowY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function electricityDemand() {
  const electricity = await d3.csv<any>("data/electricity-demand.csv", d3.autoType);
  return React.createElement(Plot, {
      width: 960,
      marginLeft: 50,
      x: {round: true, nice: "week"},
      y: {insetTop: 6}
    },
    React.createElement(Frame, {fill: "#efefef"}),
    React.createElement(RuleY, {data: [0]}),
    React.createElement(AxisX, {ticks: "year", tickSize: 28, tickPadding: -11, tickFormat: "  %Y", textAnchor: "start"}),
    React.createElement(AxisX, {ticks: "month", tickSize: 16, tickPadding: -11, tickFormat: "  %B", textAnchor: "start"}),
    React.createElement(GridX, {ticks: "week", stroke: "#fff", strokeOpacity: 1, insetBottom: -0.5}),
    React.createElement(Dot, {data: electricity, x: "date", y: "mwh", stroke: "red", strokeOpacity: 0.3}),
    React.createElement(Line, {data: electricity, ...windowY(24, {x: "date", y: "mwh"})})
  );
}
