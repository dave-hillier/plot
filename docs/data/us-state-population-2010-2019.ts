import {csvParse, autoType} from "d3";
import raw from "../public/data/us-state-population-2010-2019.csv?raw";

export default csvParse(raw).map((d) => ({...d, ...autoType(d)}));
