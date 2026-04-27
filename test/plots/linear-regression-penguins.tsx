import {Plot, Dot, LinearRegressionY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function linearRegressionPenguins() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return (
    <Plot grid={true}>
      <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" fill="species" />
      <LinearRegressionY data={penguins} x="culmen_length_mm" y="culmen_depth_mm" stroke="species" />
      <LinearRegressionY data={penguins} x="culmen_length_mm" y="culmen_depth_mm" />
    </Plot>
  );
}
