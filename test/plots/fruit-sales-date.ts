import React from "react";
import {Plot, BarY, Text, stackY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function fruitSalesDate() {
  const sales = await d3.csv<any>("data/fruit-sales.csv", d3.autoType);
  return React.createElement(Plot, {x: {type: "band"}},
    React.createElement(BarY, {data: sales, ...stackY({x: "date", y: "units", fill: "fruit"})}),
    React.createElement(Text, {data: sales, ...stackY({x: "date", y: "units", text: "fruit"})})
  );
}

export async function fruitSalesSingleDate() {
  const sales = (await d3.csv<any>("data/fruit-sales.csv", d3.autoType)).slice(0, 3);
  return React.createElement(Plot, {x: {type: "band"}},
    React.createElement(BarY, {data: sales, ...stackY({x: "date", y: "units", fill: "fruit"})}),
    React.createElement(Text, {data: sales, ...stackY({x: "date", y: "units", text: "fruit"})})
  );
}
