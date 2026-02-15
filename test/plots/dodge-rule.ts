import * as Plot from "replot";

export async function dodgeRule() {
  return Plot.ruleX([1, 2, 3], Plot.dodgeY()).plot();
}
