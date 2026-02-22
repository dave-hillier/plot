import {csvParse, autoType} from "d3";
import raw from "../public/data/sf-temperatures.csv?raw";

export default csvParse(raw).map((d) => ({...d, ...autoType(d)}));
