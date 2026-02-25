import React from "react";
import {Plot, RuleX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function seattleTemperatureBand() {
  const data = await d3.csv<any>("data/seattle-weather.csv", d3.autoType);
  return React.createElement(Plot, {
      y: {
        grid: true,
        label: "Temperature (\u00b0F)",
        transform: (f) => (f * 9) / 5 + 32 // convert from Celsius
      },
      color: {
        type: "linear",
        scheme: "BuRd"
      }
    },
    React.createElement(RuleX, {data, x: "date", y1: "temp_min", y2: "temp_max", stroke: "temp_min"})
  );
}
