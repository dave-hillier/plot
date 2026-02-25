import React from "react";
import {Plot, AxisX, BarY, GridY, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function longLabels() {
  const responses = d3.tsvParse(`name\tvalue
Family in feud with Zucker\u00adbergs\t.17
Committed 671 birthdays to memory\t.19
Ex is doing too well\t.10
High school friends all dead now\t.15
Discovered how to "like" things mentally\t.27
Not enough politics\t.12
`);
  return React.createElement(Plot, {
      margin: 20,
      marginLeft: 40,
      marginBottom: 40,
      height: 400,
      x: {label: null},
      y: {percent: true, label: "Responses (%)"}
    },
    React.createElement(AxisX, {lineWidth: 8}),
    React.createElement(BarY, {data: responses, x: "name", y: "value"}),
    React.createElement(GridY, {color: "#eee", opacity: 0.2}),
    React.createElement(RuleY, {data: [0]})
  );
}
