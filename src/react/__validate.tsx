// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders mark façades through the new pipeline so unit tests can confirm the
// imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {useMark, stampOptions} from "./useMark.js";
import {Dot} from "./marks/Dot.js";
import {frame as frameMark} from "../marks/frame.js";
import {pointer} from "../interactions/pointer.js";

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
