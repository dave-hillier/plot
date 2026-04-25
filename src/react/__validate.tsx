// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders mark façades via the new useMark contract so unit tests can confirm
// the imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {Frame} from "./marks/Frame.js";
import {RuleX, RuleY} from "./marks/Rule.js";
import {TickX, TickY} from "./marks/Tick.js";
import {Geo, Sphere, Graticule} from "./marks/Geo.js";
import {Hexgrid} from "./marks/Hexgrid.js";
import {BarY, BarX} from "./marks/Bar.js";
import {RectY, Cell, CellY} from "./marks/Rect.js";

export function validatePlot() {
  return (
    <Plot width={200} height={100}>
      <Frame stroke="black" />
    </Plot>
  );
}

export function validateFrame() {
  return (
    <Plot width={200} height={100}>
      <Frame stroke="black" />
    </Plot>
  );
}

export function validateRuleX() {
  return (
    <Plot width={200} height={100}>
      <RuleX data={[1, 2, 3]} />
    </Plot>
  );
}

export function validateRuleY() {
  return (
    <Plot width={200} height={100}>
      <RuleY data={[1, 2, 3]} />
    </Plot>
  );
}

export function validateTickX() {
  return (
    <Plot width={200} height={100}>
      <TickX data={[1, 2, 3]} />
    </Plot>
  );
}

export function validateTickY() {
  return (
    <Plot width={200} height={100}>
      <TickY data={[1, 2, 3]} />
    </Plot>
  );
}

export function validateGeo() {
  // Sphere + Graticule render a globe outline + grid via the new contract.
  return (
    <Plot width={200} height={200} projection="equirectangular">
      <Sphere stroke="black" />
      <Graticule stroke="#ccc" />
    </Plot>
  );
}

export function validateGeoData() {
  const data = [{type: "Point", coordinates: [0, 0]}];
  return (
    <Plot width={200} height={200} projection="equirectangular">
      <Geo data={data} stroke="red" />
    </Plot>
  );
}

export function validateHexgrid() {
  return (
    <Plot width={200} height={200}>
      <Hexgrid />
    </Plot>
  );
}

export function validateBarY() {
  const data = [
    {name: "a", value: 10},
    {name: "b", value: 20},
    {name: "c", value: 15}
  ];
  return (
    <Plot width={200} height={100}>
      <BarY data={data} x="name" y="value" fill="steelblue" />
    </Plot>
  );
}

export function validateBarX() {
  const data = [
    {name: "a", value: 10},
    {name: "b", value: 20}
  ];
  return (
    <Plot width={200} height={100}>
      <BarX data={data} y="name" x="value" fill="tomato" />
    </Plot>
  );
}

export function validateRectY() {
  const data = [1, 2, 3, 4, 5];
  return (
    <Plot width={200} height={100}>
      <RectY data={data} x={(_d: number, i: number) => i} y={(d: number) => d} fill="orange" />
    </Plot>
  );
}

export function validateCellY() {
  const data = [1, 2, 3, 4];
  return (
    <Plot width={200} height={100}>
      <CellY data={data} />
    </Plot>
  );
}

export function validateCell() {
  const data = [
    {x: "a", y: 1, v: 10},
    {x: "b", y: 2, v: 20}
  ];
  return (
    <Plot width={200} height={100}>
      <Cell data={data} x="x" y="y" fill="v" />
    </Plot>
  );
}
