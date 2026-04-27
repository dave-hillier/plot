import {Plot, Frame, AxisX, AxisY, RuleX, RuleY} from "../../src/react/index.js";

export async function axisLabelX() {
  return (
    <Plot inset={6} x={{type: "linear"}} y={{type: "linear", axis: null}}>
      <Frame />
      <AxisX anchor="top" label="top-left" labelAnchor="left" />
      <AxisX anchor="top" label="top-center" labelAnchor="center" ticks={[]} />
      <AxisX anchor="top" label="top-right" labelAnchor="right" ticks={[]} />
      <AxisX anchor="bottom" label="bottom-left" labelAnchor="left" />
      <AxisX anchor="bottom" label="bottom-center" labelAnchor="center" ticks={[]} />
      <AxisX anchor="bottom" label="bottom-right" labelAnchor="right" ticks={[]} />
    </Plot>
  );
}

export async function axisLabelY() {
  return (
    <Plot inset={6} x={{type: "linear", axis: null}} y={{type: "linear"}}>
      <Frame />
      <AxisY anchor="left" label="left-top" labelAnchor="top" />
      <AxisY anchor="left" label="left-center" labelAnchor="center" ticks={[]} />
      <AxisY anchor="left" label="left-bottom" labelAnchor="bottom" ticks={[]} />
      <AxisY anchor="right" label="right-top" labelAnchor="top" />
      <AxisY anchor="right" label="right-center" labelAnchor="center" ticks={[]} />
      <AxisY anchor="right" label="right-bottom" labelAnchor="bottom" ticks={[]} />
    </Plot>
  );
}

export async function axisLabelBoth() {
  return (
    <Plot
      inset={6}
      x={{type: "linear", axis: "both", labelAnchor: "center"}}
      y={{type: "linear", axis: "both", labelAnchor: "center"}}
    >
      <RuleX data={[{x: 0}, {x: 1}]} x="x" />
      <RuleY data={[{y: 0}, {y: 1}]} y="y" />
    </Plot>
  );
}

export async function axisLabelBothReverse() {
  return (
    <Plot
      inset={6}
      x={{type: "linear", reverse: true, axis: "both", labelAnchor: "center"}}
      y={{type: "linear", reverse: true, axis: "both", labelAnchor: "center"}}
    >
      <RuleX data={[{x: 0}, {x: 1}]} x="x" />
      <RuleY data={[{y: 0}, {y: 1}]} y="y" />
    </Plot>
  );
}

export async function axisLabelFontVariant() {
  return (
    <Plot x={{domain: "abcde"}}>
      <AxisX label="Letter" fontVariant="small-caps" />
    </Plot>
  );
}

export async function axisLabelVaryingFill() {
  return (
    <Plot x={{domain: "ABCDEF"}}>
      <AxisX label="Letter" fill={(d, i) => i} />
    </Plot>
  );
}

export async function axisLabelHref() {
  return (
    <Plot x={{domain: "ABCDEF"}}>
      <AxisX label="Letter" href={(d) => `https://en.wikipedia.org/wiki/${d}`} />
    </Plot>
  );
}
