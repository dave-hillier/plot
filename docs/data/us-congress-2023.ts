import {csvParse, autoType} from "d3";
import raw from "../public/data/us-congress-2023.csv?raw";

export default csvParse(raw).map((d) => ({...d, ...autoType(d)}));
