import {csvParse, autoType} from "d3";
import raw from "../public/data/tdf-stage-8-2017.csv?raw";

export default csvParse(raw).map((d) => ({...d, ...autoType(d)}));
