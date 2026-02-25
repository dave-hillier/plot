import React from "react";
import {Plot, RuleY, Dot, Text, selectMaxY, formatMonth} from "../../src/react/index.js";
import * as d3 from "d3";

export async function seattleTemperatureAmplitude() {
  const data = await d3.csv<any>("data/seattle-weather.csv", d3.autoType);
  const delta = (d) => d.temp_max - d.temp_min;
  return React.createElement(Plot, {
      x: {label: "Daily low temperature (\u00b0F)", nice: true},
      y: {label: "Daily temperature variation (\u0394\u00b0F)", zero: true},
      aspectRatio: 1,
      color: {
        type: "cyclical",
        legend: true,
        tickFormat: formatMonth()
      }
    },
    React.createElement(RuleY, {data: [0]}),
    React.createElement(Dot, {data, fill: (d) => d.date.getUTCMonth(), x: "temp_min", y: delta}),
    React.createElement(Dot, {data, ...selectMaxY({x: "temp_min", y: delta, r: 5})}),
    React.createElement(Text, {data, ...selectMaxY({x: "temp_min", y: delta, text: "date", lineAnchor: "bottom", dy: -10})})
  );
}
