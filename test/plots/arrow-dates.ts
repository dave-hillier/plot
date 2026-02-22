import React from "react";
import {Plot, RectY, binX} from "../../src/react/index.js";
import * as Arrow from "apache-arrow";
import * as d3 from "d3";

export async function arrowDates() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  const table = Arrow.tableFromJSON(athletes);
  return React.createElement(Plot, {},
    React.createElement(RectY, {data: table, ...binX(undefined, {x: "date_of_birth"})})
  );
}
