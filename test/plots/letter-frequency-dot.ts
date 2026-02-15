import * as Plot from "replot";
import * as d3 from "d3";

export async function letterFrequencyDot() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return Plot.plot({
    marks: [Plot.dot(alphabet, {x: "letter", r: "frequency"})]
  });
}
