import {csvParse, autoType} from "d3";
import {useDataset} from "../components/useDataset";

// Great Britain aeromagnetic survey samples; fetched lazily (~360 kB CSV).
async function load() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/ca55-south.csv`);
  const raw = await response.text();
  return csvParse(raw).map((d) => ({...d, ...autoType(d)}));
}

export function useCa55() {
  return useDataset("ca55", load);
}
