import React from "react";
import {Plot, BarY, TickY, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function downloadsOrdinal() {
  const downloads = (await d3.csv<any>("data/downloads.csv", d3.autoType)).filter(
    (d) => d.date.getUTCFullYear() === 2019 && d.date.getUTCMonth() <= 1 && d.downloads > 0
  );
  return React.createElement(Plot, {x: {interval: "day"}},
    React.createElement(BarY, {data: downloads, x: "date", y: "downloads", fill: "#ccc"}),
    React.createElement(TickY, {data: downloads, x: "date", y: "downloads"}),
    React.createElement(RuleY, {data: [0]})
  );
}
