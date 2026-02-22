import {csvParse, autoType} from "d3";
import raw from "../public/data/cars.csv?raw";

export default csvParse(raw).map((d) => ({...d, ...autoType(d)}));
