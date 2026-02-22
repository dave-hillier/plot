import React from "react";
import {Plot, RectY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

const dates = new Array(1e6);
const start = +new Date("2020-01-01");
const end = +new Date("2021-01-01");
const random = d3.randomLcg(42);
for (let i = 0; i < dates.length; ++i) dates[i] = new Date(random() * (end - start) + start);

export async function bin1m() {
  return React.createElement(Plot, {},
    React.createElement(RectY, {data: dates, ...binX({y: "count", data: "first"})})
  );
}
