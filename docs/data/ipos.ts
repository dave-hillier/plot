import {csvParse, autoType} from "d3";
import {useDataset} from "../components/useDataset";

// Fetched lazily from the static assets dir at runtime (the CSV is >100 kB).
async function load() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/ipos.csv`);
  const raw = await response.text();
  return csvParse(raw).map((d) => ({...d, ...autoType(d)}));
}

export function useIpos() {
  return useDataset("ipos", load);
}
