import assert from "assert";
import it from "./jsdom.js";
import * as Plot from "../src/index.js";

describe("aspectRatio with empty data", () => {
  it("falls back to a finite default height", () => {
    const svg = Plot.plot({
      aspectRatio: 1,
      marks: [Plot.rectY([], {x: "a", y: "b"})]
    });
    const height = Number(svg.getAttribute("height"));
    assert.ok(Number.isFinite(height) && height > 0, `expected finite height, got ${svg.getAttribute("height")}`);
    assert.ok(!(svg.getAttribute("viewBox") ?? "").includes("NaN"));
  });

  it("still honors aspectRatio with non-empty data", () => {
    const tall = Plot.plot({
      aspectRatio: 0.5,
      marks: [
        Plot.dot(
          [
            {a: 0, b: 0},
            {a: 10, b: 10}
          ],
          {x: "a", y: "b"}
        )
      ]
    });
    const square = Plot.plot({
      aspectRatio: 1,
      marks: [
        Plot.dot(
          [
            {a: 0, b: 0},
            {a: 10, b: 10}
          ],
          {x: "a", y: "b"}
        )
      ]
    });
    assert.ok(Number(tall.getAttribute("height")) > Number(square.getAttribute("height")));
  });
});
