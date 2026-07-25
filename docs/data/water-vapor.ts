import {csvParseRows} from "d3";
import {useDataset} from "../components/useDataset";

// NASA MODIS atmospheric water-vapor grid (360x180, row-major); the sentinel
// value 99999.0 encodes missing data. Fetched lazily (~320 kB CSV).
async function load() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/MYDAL2_M_SKY_WV_2022-11-01_rgb_360x180.csv`);
  const text = await response.text();
  return csvParseRows(text)
    .flat()
    .map((x) => (x === "99999.0" ? NaN : +x));
}

export function useVapor() {
  return useDataset("water-vapor", load);
}
