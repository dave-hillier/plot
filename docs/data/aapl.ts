import {csvParse, autoType} from "d3";
import raw from "../public/data/aapl.csv?raw";

export default csvParse(raw).map((d) => ({...d, ...autoType(d)}));
