import {csvParse, autoType} from "d3";
import {useDataset} from "../components/useDataset";

// Fetched from the static assets dir at runtime rather than bundled (~406 kB).
async function load() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/bls-metro-unemployment.csv`);
  const raw = await response.text();
  return csvParse(raw).map((d) => ({...d, ...autoType(d)}));
}

export function useBlsMetroUnemployment() {
  return useDataset("bls-metro-unemployment", load);
}
