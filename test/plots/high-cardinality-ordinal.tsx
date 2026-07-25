import {Replot, CellX} from "../../src/react/index.js";

export async function highCardinalityOrdinal() {
  return (
    <Replot color={{type: "ordinal"}}>
      <CellX data="ABCDEFGHIJKLMNOPQRSTUVWXYZ" />
    </Replot>
  );
}
