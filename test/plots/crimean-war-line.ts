import React from "react";
import {Plot, RuleY, LineY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function crimeanWarLine() {
  const crimea = await d3.csv<any>("data/crimean-war.csv", d3.autoType);
  const causes = crimea.columns.slice(2);
  const data = causes.flatMap((cause) => crimea.map(({date, [cause]: deaths}) => ({date, cause, deaths})));
  return React.createElement(Plot, {
      x: {
        tickFormat: "%b",
        label: null
      }
    },
    React.createElement(RuleY, {data: [0]}),
    React.createElement(LineY, {data, x: "date", y: "deaths", stroke: "cause", marker: "circle"})
  );
}
