import {csvParse, autoType} from "d3";
import {useDataset} from "../components/useDataset";

// Fetched from the static assets dir at runtime rather than bundled (~120 kB).
async function load() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/simpsons.csv`);
  const raw = await response.text();
  return csvParse(raw).map((d) => ({...d, ...autoType(d)}));
}

export function useSimpsons() {
  return useDataset("simpsons", load);
}
