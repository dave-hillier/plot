import {csvParse} from "d3";
import raw from "../public/data/us-presidential-election-2020.csv?raw";

export default csvParse(raw);
