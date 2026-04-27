import {Plot, DotX} from "../../src/react/index.js";

export async function infinityLog() {
  return (
    <Plot x={{type: "log", tickFormat: "f"}}>
      <DotX data={[NaN, 0.2, 0, 1, 2, 1 / 0]} />
    </Plot>
  );
}
