// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders a single Frame mark via the new façade so the unit test can confirm
// the imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {useMark, stampOptions} from "./useMark.js";
import {frame as frameMark} from "../marks/frame.js";
import {Line, LineX, LineY} from "./marks/Line.js";
import {Area, AreaX, AreaY} from "./marks/Area.js";

function FrameNew(props: Record<string, any>) {
  useMark({
    stamp: stampOptions("frame", null, props),
    factory: () => frameMark(props)
  });
  return null;
}

export function validatePlot() {
  return (
    <Plot width={200} height={100}>
      <FrameNew stroke="black" />
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
