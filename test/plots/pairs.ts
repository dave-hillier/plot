import * as Plot from "replot";
import * as d3 from "d3";

export async function pairsArea() {
  return Plot.areaY({length: 15}, {y: d3.randomLcg(42), stroke: (d, i) => i >> 1}).plot({axis: null, height: 140});
}
