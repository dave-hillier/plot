import {Plot, Frame} from "../../src/react/index.js";

export async function empty() {
  return (
    <Plot grid={true} inset={6} x={{type: "linear"}} y={{type: "linear"}}>
      <Frame />
      {/* TODO: arrow fn marks — undefined, null, () => null, () => undefined, () => svg`<circle cx=50% cy=50% r=5 fill=green>` */}
    </Plot>
  );
}
