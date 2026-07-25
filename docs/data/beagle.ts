import {csvParseRows, autoType} from "d3";
import raw from "../public/data/beagle.csv?raw";

// The voyage of HMS Beagle as [longitude, latitude] pairs.
export default csvParseRows(raw).map((d) => autoType(d) as unknown as [number, number]);
