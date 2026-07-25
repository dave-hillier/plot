import {csvParse, autoType} from "d3";
import {useDataset} from "../components/useDataset";

// Fetched from the static assets dir at runtime rather than bundled: the
// CSV is ~160 kB.
async function load() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/wind.csv`);
  const raw = await response.text();
  return csvParse(raw).map((d) => ({...d, ...autoType(d)}));
}

export function useWind() {
  return useDataset("wind", load);
}
