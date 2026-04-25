// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders marks via the new façade so unit tests can confirm the imperative
// mount path works end-to-end. Delete once real marks have migrated off the
// legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {useMark, stampOptions} from "./useMark.js";
import {frame as frameMark} from "../marks/frame.js";
import {dot as dotMark} from "../marks/dot.js";
import {AxisX, AxisY, AxisFx, AxisFy, GridX, GridY, GridFx, GridFy} from "./marks/Axis.js";

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

// Facet axes need an fx/fy scale, which is created by a mark with an fx/fy
// channel. Seed the facet scale via a frame mark with the appropriate facet data.
function FacetSeed({data, ...rest}: Record<string, any>) {
  useMark({
    stamp: stampOptions("dotSeed", data, rest),
    factory: () => dotMark(data, rest)
  });
  return null;
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
