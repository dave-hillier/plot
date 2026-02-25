import React from "react";
import {Plot, BarX, TextX, RuleX, groupY, formatMonth} from "../../src/react/index.js";
import * as d3 from "d3";

export async function athletesBirthdays() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      marginRight: 40,
      y: {
        tickFormat: formatMonth()
      }
    },
    React.createElement(BarX, {data: athletes, ...groupY({x: "count"}, {y: (d) => d.date_of_birth.getUTCMonth()})}),
    React.createElement(TextX, {
      data: athletes,
      ...groupY({x: "count", text: "count"}, {y: (d) => d.date_of_birth.getUTCMonth(), dx: 4, frameAnchor: "left"})
    }),
    React.createElement(RuleX, {data: [0]})
  );
}
