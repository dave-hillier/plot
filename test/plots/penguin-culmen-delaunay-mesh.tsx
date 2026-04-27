import {Plot, DelaunayMesh, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinCulmenDelaunayMesh() {
  const data = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return (
    <Plot>
      <DelaunayMesh data={data} x="culmen_depth_mm" y="culmen_length_mm" />
      <Dot data={data} x="culmen_depth_mm" y="culmen_length_mm" />
    </Plot>
  );
}
