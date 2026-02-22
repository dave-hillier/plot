import React from "react";
import {Plot, Auto, Line, TickX, CellX, BarY} from "../../src/react/index.js";
import * as d3 from "d3";

const integers = d3.range(40).map((int) => ({
  big1: BigInt(int),
  big2: BigInt(int * int)
}));

export async function bigint1() {
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: integers, x: "big2"})
  );
}

export async function bigint2() {
  return React.createElement(Plot, {},
    React.createElement(Line, {data: integers, x: "big1", y: "big2", marker: "circle"})
  );
}

export async function bigintLog() {
  return React.createElement(Plot, {x: {type: "log"}},
    React.createElement(TickX, {data: integers, x: "big2", stroke: "big1"})
  );
}

export async function bigintOrdinal() {
  return React.createElement(Plot, {color: {type: "log", legend: true}},
    React.createElement(CellX, {data: integers.slice(1, 11), x: "big1", fill: "big1"})
  );
}

export async function bigintStack() {
  return React.createElement(Plot, {},
    React.createElement(BarY, {data: integers, x: (d, i) => i % 5, y: "big1"})
  );
}
