import * as d3 from "d3";
import {chooseOne} from "./d3-survey-2015.js";

export async function d3Survey2015Comfort() {
  const responses = await d3.json<any>("data/d3-survey-2015.json");
  return chooseOne(responses, "comfort", "How comfortable are you with d3 now?");
}
