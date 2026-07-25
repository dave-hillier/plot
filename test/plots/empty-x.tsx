import {Replot, Frame} from "../../src/react/index.js";

export async function emptyX() {
  return (
    <Replot
      grid={true}
      x={{
        domain: [0, 1],
        axis: null
      }}
    >
      <Frame />
    </Replot>
  );
}
