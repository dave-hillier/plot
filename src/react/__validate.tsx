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
import {Line, LineX, LineY} from "./marks/Line.js";
import {Area, AreaX, AreaY} from "./marks/Area.js";
import {Dot} from "./marks/Dot.js";
import {pointer} from "../interactions/pointer.js";

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

const lineData = [
  {x: 0, y: 0},
  {x: 1, y: 1},
  {x: 2, y: 4},
  {x: 3, y: 9}
];

export function validateLine() {
  return (
    <Plot width={200} height={100}>
      <Line data={lineData} x="x" y="y" />
    </Plot>
  );
}

export function validateLineX() {
  return (
    <Plot width={200} height={100}>
      <LineX data={[1, 2, 3, 4, 5]} />
    </Plot>
  );
}

export function validateLineY() {
  return (
    <Plot width={200} height={100}>
      <LineY data={[1, 2, 3, 4, 5]} />
    </Plot>
  );
}

export function validateArea() {
  return (
    <Plot width={200} height={100}>
      <Area data={lineData} x1="x" y1="y" />
    </Plot>
  );
}

export function validateAreaX() {
  return (
    <Plot width={200} height={100}>
      <AreaX data={[1, 2, 3, 4, 5]} />
    </Plot>
  );
}

export function validateAreaY() {
  return (
    <Plot width={200} height={100}>
      <AreaY data={[1, 2, 3, 4, 5]} />
    </Plot>
  );
}

const dotData = [
  {x: 1, y: 1},
  {x: 2, y: 4},
  {x: 3, y: 9}
];

export function validateDot() {
  return (
    <Plot width={200} height={200}>
      <Dot data={dotData} x="x" y="y" stroke="red" />
    </Plot>
  );
}

export function validateDotPointer() {
  return (
    <Plot width={200} height={200}>
      <Dot data={dotData} {...pointer({x: "x", y: "y"})} stroke="blue" />
    </Plot>
  );
}
