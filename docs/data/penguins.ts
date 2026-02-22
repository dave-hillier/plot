import {csvParse, autoType} from "d3";
import raw from "../public/data/penguins.csv?raw";

export default csvParse(raw).map((d) => ({...d, ...autoType(d)}));
