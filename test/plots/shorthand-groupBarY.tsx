import {Replot, BarY, groupX} from "../../src/react/index.js";

export async function shorthandGroupBarY() {
  const gene = "AAAAGAGTGAAGATGCTGGAGACGAGTGAAGCATTCACTTTAGGGAAAGCGAGGCAAGAGCGTTTCAGAAGACGAAACCTGGTAGGTGCACTCACCACAG";
  return (
    <Replot>
      <BarY data={gene} {...groupX()} />
    </Replot>
  );
}
