import {csvParse, autoType} from "d3";
import {useDataset} from "../components/useDataset";

// Fetched from the static assets dir at runtime rather than bundled (~430 kB).
async function load() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/dji.csv`);
  const raw = await response.text();
  return csvParse(raw).map((d) => ({...d, ...autoType(d)}));
}

export function useDji() {
  return useDataset("dji", load);
}
