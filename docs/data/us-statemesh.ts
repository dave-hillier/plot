import * as topojson from "topojson-client";
import {useResource} from "../components/useDataset";

// All U.S. state borders (including the coastline), as a single mesh geometry.
export function useStatemeshAll() {
  return useResource("us-statemesh-all", async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}data/us-counties-10m.json`);
    const us = await response.json();
    return topojson.mesh(us, us.objects.states);
  });
}
