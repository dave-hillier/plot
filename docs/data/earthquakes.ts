import {useResource} from "../components/useDataset.js";

// Live USGS feed of earthquakes in the last week with magnitude 2.5+, as in
// the upstream Observable Plot documentation.
export function useEarthquakes() {
  return useResource("earthquakes", async () => {
    const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson");
    const collection = await response.json();
    return collection.features;
  });
}
