import {Plot, VoronoiMesh, Dot, dodgeY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinDodgeVoronoi() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return (
    <Plot height={200}>
      <VoronoiMesh data={penguins} {...dodgeY({x: "body_mass_g"})} />
      <Dot data={penguins} {...dodgeY({x: "body_mass_g", fill: "currentColor"})} />
    </Plot>
  );
}
