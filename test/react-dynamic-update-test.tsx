// @ts-nocheck — JSDOM React tests for <Plot> recompute-on-update invalidation.
import assert from "assert";
import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import {act} from "react";
import jsdomit from "./jsdom.js";
import {Plot, Dot} from "../src/react/index.js";

const dataA = [
  {x: 1, y: 2},
  {x: 2, y: 3},
  {x: 3, y: 1}
];

const dataB = [
  {x: 1, y: 9},
  {x: 2, y: 1},
  {x: 3, y: 5}
];

async function mount(node) {
  const container = (globalThis as any).document.createElement("div");
  (globalThis as any).document.body.appendChild(container);
  let root: any;
  await act(async () => {
    root = ReactDOM.createRoot(container);
    root.render(node);
  });
  await act(async () => {});
  await act(async () => {});
  return {
    container,
    cleanup: async () => {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    }
  };
}

function svgMarkup(container) {
  const svg = container.querySelector("svg");
  assert.ok(svg, "expected an <svg>");
  return svg.outerHTML;
}

describe("Plot recomputes when mark props change after mount", () => {
  jsdomit("updates the SVG when a mark's data changes", async () => {
    let setData;
    function Harness() {
      const [data, set] = useState(dataA);
      setData = set;
      return (
        <Plot width={200} height={200}>
          <Dot data={data} x="x" y="y" />
        </Plot>
      );
    }
    const {container, cleanup} = await mount(<Harness />);
    const before = svgMarkup(container);
    await act(async () => setData(dataB));
    await act(async () => {});
    const after = svgMarkup(container);
    assert.notStrictEqual(after, before, "expected the SVG to change when data changes");
    await cleanup();
  });

  jsdomit("updates the SVG when a constant channel value changes", async () => {
    let setR;
    function Harness() {
      const [r, set] = useState(3);
      setR = set;
      return (
        <Plot width={200} height={200}>
          <Dot data={dataA} x="x" y="y" r={r} />
        </Plot>
      );
    }
    const {container, cleanup} = await mount(<Harness />);
    const before = svgMarkup(container);
    await act(async () => setR(9));
    await act(async () => {});
    const after = svgMarkup(container);
    assert.notStrictEqual(after, before, "expected the SVG to change when a constant channel changes");
    await cleanup();
  });

  jsdomit("updates the SVG when a channel field name changes", async () => {
    let setField;
    function Harness() {
      const [field, set] = useState("y");
      setField = set;
      return (
        <Plot width={200} height={200}>
          <Dot data={dataA} x="x" y={field} />
        </Plot>
      );
    }
    const {container, cleanup} = await mount(<Harness />);
    const before = svgMarkup(container);
    await act(async () => setField("x"));
    await act(async () => {});
    const after = svgMarkup(container);
    assert.notStrictEqual(after, before, "expected the SVG to change when a channel field changes");
    await cleanup();
  });
});
