import React from "react";
import {Plot, BarX, RuleX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function learningPoverty() {
  const data = await d3.csv<any>("data/learning-poverty.csv", d3.autoType);
  const values = data.flatMap((d) => [
    {...d, type: "ok", share: 100 - d["Learning Poverty"]},
    {...d, type: "poor", share: d["Learning Poverty"] - d["Out-of-School (OoS)"]},
    {...d, type: "out of school", share: d["Out-of-School (OoS)"]}
  ]);
  return React.createElement(Plot, {
      marginLeft: 120,
      height: 1160,
      x: {axis: "top", grid: true, ticks: 10, tickFormat: (d) => `${Math.abs(d)}%`, nice: true},
      y: {label: null},
      color: {
        domain: ["ok", "poor", "out of school"],
        range: ["#aed9e0", "#edd382", "#ffa69e"]
      }
    },
    React.createElement(BarX, {
      data: values,
      x: (d) => (d.type === "ok" ? -1 : 1) * d.share, // diverging bars
      y: "Country Name",
      fill: "type",
      sort: {y: "-x"}
    }),
    React.createElement(RuleX, {data: [0]})
  );
}
