import * as topojson from "topojson-client";
import {useResource} from "../components/useDataset";

// All U.S. state borders (including coastlines) as a single mesh geometry.
// Unlike useStatemesh in us-atlas.ts, this does not filter out the exterior
// borders; it is used by the centroid transform documentation.
export function useStatemeshFull() {
  return useResource("us-statemesh-full", async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}data/us-counties-10m.json`);
    const us = await response.json();
    return topojson.mesh(us, us.objects.states);
  });
}
