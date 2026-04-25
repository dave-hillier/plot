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
import {Text} from "./marks/Text.js";
import {Link} from "./marks/Link.js";
import {Arrow} from "./marks/Arrow.js";
import {Vector, Spike} from "./marks/Vector.js";
import {Image} from "./marks/Image.js";
import {AxisX, AxisY, AxisFx, AxisFy, GridX, GridY, GridFx, GridFy} from "./marks/Axis.js";
import {useMark, stampOptions} from "./useMark.js";
import {dot as dotMark} from "../marks/dot.js";
import {frame as frameMark} from "../marks/frame.js";
import {BollingerY} from "./marks/Bollinger.js";
import {DifferenceY} from "./marks/Difference.js";
import {LinearRegressionY} from "./marks/LinearRegression.js";
import {BoxY} from "./marks/Box.js";
import {TreeMark} from "./marks/Tree.js";
import {Auto} from "./marks/Auto.js";

// Facet axes need an fx/fy scale, which is created by a mark with an fx/fy
// channel. Seed the facet scale via a dot mark with the appropriate facet data.
function FacetSeed({data, ...rest}: Record<string, any>) {
  useMark({
    stamp: stampOptions("dotSeed", data, rest),
    factory: () => dotMark(data, rest)
  });
  return null;
}

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

export function validateText() {
  const data = [
    {x: 1, y: 2, label: "a"},
    {x: 3, y: 4, label: "b"}
  ];
  return (
    <Plot width={200} height={100}>
      <Text data={data} x="x" y="y" text="label" fill="red" />
    </Plot>
  );
}

export function validateLink() {
  const data = [
    {x1: 0, y1: 0, x2: 10, y2: 10},
    {x1: 5, y1: 5, x2: 15, y2: 15}
  ];
  return (
    <Plot width={200} height={100}>
      <Link data={data} x1="x1" y1="y1" x2="x2" y2="y2" stroke="blue" />
    </Plot>
  );
}

export function validateArrow() {
  const data = [
    {x1: 0, y1: 0, x2: 10, y2: 10},
    {x1: 5, y1: 5, x2: 15, y2: 15}
  ];
  return (
    <Plot width={200} height={100}>
      <Arrow data={data} x1="x1" y1="y1" x2="x2" y2="y2" stroke="green" />
    </Plot>
  );
}

export function validateVector() {
  const data = [
    {x: 1, y: 1, len: 10},
    {x: 2, y: 2, len: 20},
    {x: 3, y: 3, len: 30}
  ];
  return (
    <Plot width={200} height={200}>
      <Vector data={data} x="x" y="y" length="len" stroke="red" />
    </Plot>
  );
}

export function validateSpike() {
  const data = [
    {x: 1, y: 1, len: 10},
    {x: 2, y: 2, len: 20}
  ];
  return (
    <Plot width={200} height={200}>
      <Spike data={data} x="x" y="y" length="len" stroke="blue" />
    </Plot>
  );
}

export function validateImage() {
  const data = [
    {x: 1, y: 1},
    {x: 2, y: 2}
  ];
  return (
    <Plot width={200} height={200}>
      <Image data={data} x="x" y="y" src="https://example.com/img.png" width={16} height={16} />
    </Plot>
  );
}


export function validateAxisX() {
  return (
    <Plot width={300} height={200} x={{domain: [0, 10]}}>
      <AxisX />
    </Plot>
  );
}

export function validateAxisY() {
  return (
    <Plot width={300} height={200} y={{domain: [0, 10]}}>
      <AxisY />
    </Plot>
  );
}

export function validateGridX() {
  return (
    <Plot width={300} height={200} x={{domain: [0, 10]}}>
      <GridX />
    </Plot>
  );
}

export function validateGridY() {
  return (
    <Plot width={300} height={200} y={{domain: [0, 10]}}>
      <GridY />
    </Plot>
  );
}

export function validateAxisFx() {
  return (
    <Plot width={300} height={200}>
      <FacetSeed data={["a", "b", "c"]} fx={(d: string) => d} />
      <AxisFx />
    </Plot>
  );
}

export function validateAxisFy() {
  return (
    <Plot width={300} height={200}>
      <FacetSeed data={["a", "b", "c"]} fy={(d: string) => d} />
      <AxisFy />
    </Plot>
  );
}

export function validateGridFx() {
  return (
    <Plot width={300} height={200}>
      <FacetSeed data={["a", "b", "c"]} fx={(d: string) => d} />
      <GridFx />
    </Plot>
  );
}

export function validateGridFy() {
  return (
    <Plot width={300} height={200}>
      <FacetSeed data={["a", "b", "c"]} fy={(d: string) => d} />
      <GridFy />
    </Plot>
  );
}

export function validateBollingerY() {
  // A series with enough samples for the n=5 window — verifies the band
  // (area + line) is actually computed by the imperative bollingerY composite.
  const data = [
    10, 11, 12, 13, 14, 13, 12, 13, 15, 17,
    18, 19, 18, 17, 16, 17, 19, 20, 21, 22
  ];
  return (
    <Plot width={300} height={150}>
      <BollingerY data={data} n={5} />
    </Plot>
  );
}

export function validateDifferenceY() {
  const data = [
    {x: 0, y1: 1, y2: 2},
    {x: 1, y1: 3, y2: 2},
    {x: 2, y1: 5, y2: 4},
    {x: 3, y1: 4, y2: 6},
    {x: 4, y1: 6, y2: 5}
  ];
  return (
    <Plot width={300} height={150}>
      <DifferenceY data={data} x="x" y1="y1" y2="y2" />
    </Plot>
  );
}

export function validateLinearRegressionY() {
  const data = [
    {x: 0, y: 1},
    {x: 1, y: 2.1},
    {x: 2, y: 2.9},
    {x: 3, y: 4.05},
    {x: 4, y: 5.1}
  ];
  return (
    <Plot width={300} height={150}>
      <LinearRegressionY data={data} x="x" y="y" />
    </Plot>
  );
}

export function validateBoxY() {
  // Two groups, each with values that include outliers; imperative boxY
  // should emit rule + bar + tick + dot.
  const data = [
    {g: "a", v: 1}, {g: "a", v: 2}, {g: "a", v: 3}, {g: "a", v: 4},
    {g: "a", v: 5}, {g: "a", v: 6}, {g: "a", v: 7}, {g: "a", v: 50},
    {g: "b", v: 2}, {g: "b", v: 3}, {g: "b", v: 4}, {g: "b", v: 5},
    {g: "b", v: 6}, {g: "b", v: 7}, {g: "b", v: 8}
  ];
  return (
    <Plot width={300} height={200}>
      <BoxY data={data} x="g" y="v" />
    </Plot>
  );
}

export function validateTreeMark() {
  // Flat hierarchical input — imperative tree() must run treeNode/treeLink
  // transforms to compute positions from path strings.
  const data = [
    "root",
    "root/a",
    "root/a/aa",
    "root/a/ab",
    "root/b",
    "root/b/ba",
    "root/b/bb"
  ];
  return (
    <Plot width={400} height={200} margin={20}>
      <TreeMark data={data} />
    </Plot>
  );
}

export function validateAuto() {
  const data = [
    {x: 0, y: 0},
    {x: 1, y: 1},
    {x: 2, y: 4},
    {x: 3, y: 9}
  ];
  return (
    <Plot width={300} height={200}>
      <Auto data={data} x="x" y="y" />
    </Plot>
  );
}
