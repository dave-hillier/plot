import {Plot, BarY, groupX} from "../../src/react/index.js";

export async function shorthandGroupBarY() {
  const gene = "AAAAGAGTGAAGATGCTGGAGACGAGTGAAGCATTCACTTTAGGGAAAGCGAGGCAAGAGCGTTTCAGAAGACGAAACCTGGTAGGTGCACTCACCACAG";
  return (
    <Plot>
      <BarY data={gene} {...groupX()} />
    </Plot>
  );
}
