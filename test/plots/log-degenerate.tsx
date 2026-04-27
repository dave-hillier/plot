import {Plot, DotX} from "../../src/react/index.js";

export async function logDegenerate() {
  return (
    <Plot x={{type: "log"}}>
      <DotX data={[0, 0.1, 1, 2, 10]} />
    </Plot>
  );
}
