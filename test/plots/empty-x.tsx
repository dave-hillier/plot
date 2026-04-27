import {Plot, Frame} from "../../src/react/index.js";

export async function emptyX() {
  return (
    <Plot
      grid={true}
      x={{
        domain: [0, 1],
        axis: null
      }}
    >
      <Frame />
    </Plot>
  );
}
