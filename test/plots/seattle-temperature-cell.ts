import React from "react";
import {Plot, Cell, group} from "../../src/react/index.js";
import * as d3 from "d3";

export async function seattleTemperatureCell() {
  const seattle = await d3.csv<any>("data/seattle-weather.csv", d3.autoType);
  return React.createElement(Plot, {
      height: 300,
      padding: 0,
      y: {
        tickFormat: (i) => "JFMAMJJASOND"[i]
      }
    },
    React.createElement(Cell, {
      data: seattle,
      ...group(
        {fill: "max"},
        {
          x: (d) => d.date.getUTCDate(),
          y: (d) => d.date.getUTCMonth(),
          fill: "temp_max",
          inset: 0.5
        }
      )
    })
  );
}
