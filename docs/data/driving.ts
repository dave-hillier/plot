import {csvParse, autoType} from "d3";
import raw from "../public/data/driving.csv?raw";

export default csvParse(raw).map((d) => ({...d, ...autoType(d)}));
