import {Plot, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function decathlon() {
  const decathlon = await d3.csv<any>("data/decathlon.csv", d3.autoType);
  return (
    <Plot grid={true} inset={12} symbol={{legend: true}}>
      <Dot data={decathlon} x="Long Jump" y="100 Meters" symbol="Country" stroke="Country" />
    </Plot>
  );
}
