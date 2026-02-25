import React from "react";
import {Plot, BarX, RuleX, groupY} from "../../src/react/index.js";
import * as d3 from "d3";

function Likert(
  responses: [string, number][] = [
    ["Strongly Disagree", -1],
    ["Disagree", -1],
    ["Neutral", 0],
    ["Agree", 1],
    ["Strongly Agree", 1]
  ]
): {
  order: string[];
  offset: any;
} {
  const map = new Map(responses);
  return {
    order: Array.from(map.keys()),
    offset(facetstacks, X1, X2, Z) {
      for (const stacks of facetstacks) {
        for (const stack of stacks) {
          const k = d3.sum(stack, (i) => (X2[i] - X1[i]) * (1 - map.get(Z[i]))) / 2;
          for (const i of stack) {
            X1[i] -= k;
            X2[i] -= k;
          }
        }
      }
    }
  };
}

export async function likertSurvey() {
  const survey = await d3.csv<any>("data/survey.csv");
  const {order, offset} = Likert();
  return React.createElement(Plot, {
      x: {
        tickFormat: Math.abs,
        label: "\u2190 more disagree \u00b7 Number of responses \u00b7 more agree \u2192",
        labelAnchor: "center"
      },
      y: {tickSize: 0},
      color: {legend: true, domain: order, scheme: "RdBu"}
    },
    React.createElement(BarX, {data: survey, ...groupY({x: "count"}, {y: "Question", fill: "Response", order, offset})}),
    React.createElement(RuleX, {data: [0]})
  );
}
