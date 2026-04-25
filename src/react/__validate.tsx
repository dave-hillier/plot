// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders a single Frame mark via the new façade so the unit test can confirm
// the imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {useMark, stampOptions} from "./useMark.js";
import {frame as frameMark} from "../marks/frame.js";
import {Text} from "./marks/Text.js";
import {Link} from "./marks/Link.js";
import {Arrow} from "./marks/Arrow.js";

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
