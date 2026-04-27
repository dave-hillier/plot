import {Plot, CellX} from "../../src/react/index.js";

export async function highCardinalityOrdinal() {
  return (
    <Plot color={{type: "ordinal"}}>
      <CellX data="ABCDEFGHIJKLMNOPQRSTUVWXYZ" />
    </Plot>
  );
}
