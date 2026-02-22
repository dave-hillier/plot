import React from "react";
import {Plot, Cell, CellX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function shorthandCell() {
  const matrix = [
    ["Jacob", "Olivia"],
    ["Mia", "Noah"],
    ["Noah", "Ava"],
    ["Ava", "Mason"],
    ["Olivia", "Noah"],
    ["Jacob", "Emma"],
    ["Ava", "Noah"],
    ["Noah", "Jacob"],
    ["Olivia", "Ava"],
    ["Mason", "Emma"],
    ["Jacob", "Mia"],
    ["Mia", "Jacob"],
    ["Emma", "Jacob"]
  ];
  return React.createElement(Plot, {},
    React.createElement(Cell, {data: matrix})
  );
}

export async function shorthandCellCategorical() {
  return React.createElement(Plot, {color: {scheme: "Tableau10"}},
    React.createElement(CellX, {data: d3.range(10)})
  );
}
