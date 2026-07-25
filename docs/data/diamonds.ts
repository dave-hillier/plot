import {csvParse, autoType} from "d3";
import {useDataset} from "../components/useDataset";

// Fetched from the static assets dir at runtime rather than bundled: the
// parsed CSV is ~2.4 MB as a JS chunk (issue #115).
async function load() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/diamonds.csv`);
  const raw = await response.text();
  return csvParse(raw).map((d) => ({...d, ...autoType(d)}));
}

export function useDiamonds() {
  return useDataset("diamonds", load);
}
