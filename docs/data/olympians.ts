import {csvParse, autoType} from "d3";
import {useDataset} from "../components/useDataset";

// Fetched from the static assets dir at runtime rather than bundled: the
// parsed CSV is ~840 kB as a JS chunk (issue #115).
async function load() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/athletes.csv`);
  const raw = await response.text();
  return csvParse(raw).map((d) => ({...d, ...autoType(d)}));
}

export function useOlympians() {
  return useDataset("olympians", load);
}
