import * as topojson from "topojson-client";
import {useResource} from "../components/useDataset.js";

async function loadWorld() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/countries-110m.json`);
  return response.json();
}

// The world land mass as a single GeoJSON feature; null until loaded.
export function useLand() {
  return useResource("land", async () => {
    const world = await loadWorld();
    return topojson.feature(world, world.objects.land);
  });
}
