import {promises as fs} from "fs";
import * as path from "path";
import {JSDOM} from "jsdom";

export default function jsdomit(description, run) {
  return it(description, withJsdom(run));
}

jsdomit.skip = (description, run) => {
  return it.skip(description, withJsdom(run));
};

jsdomit.only = (description, run) => {
  return it.only(description, withJsdom(run));
};

// Globals that React and ReactDOM require beyond basic JSDOM.
// Do NOT include queueMicrotask or MessageChannel — Node.js provides them
// natively, and JSDOM's versions cause infinite recursion when assigned to global.
const REACT_GLOBALS = [
  "window", "document", "Event", "Node", "NodeList", "HTMLCollection",
  "HTMLElement", "SVGElement", "MutationObserver", "navigator",
  "requestAnimationFrame", "cancelAnimationFrame",
  "CustomEvent", "getComputedStyle"
];

function withJsdom(run) {
  return async () => {
    const jsdom = new JSDOM("");
    const saved = {};
    for (const key of REACT_GLOBALS) {
      saved[key] = global[key];
      if (key in jsdom.window) {
        try {
          global[key] = jsdom.window[key];
        } catch {
          // Some properties (e.g. navigator) are read-only on the global object;
          // override them via Object.defineProperty.
          Object.defineProperty(global, key, {value: jsdom.window[key], writable: true, configurable: true});
        }
      }
    }
    global.fetch = async (href) => new Response(path.resolve("./test", href));
    global.IS_REACT_ACT_ENVIRONMENT = true;
    try {
      return await run();
    } finally {
      for (const key of REACT_GLOBALS) {
        if (saved[key] === undefined) delete global[key];
        else {
          try {
            global[key] = saved[key];
          } catch {
            Object.defineProperty(global, key, {value: saved[key], writable: true, configurable: true});
          }
        }
      }
      delete global.fetch;
      delete global.IS_REACT_ACT_ENVIRONMENT;
    }
  };
}

class Response {
  constructor(href) {
    this._href = href;
    this.ok = true;
    this.status = 200;
  }
  async text() {
    return fs.readFile(this._href, {encoding: "utf-8"});
  }
  async json() {
    return JSON.parse(await this.text());
  }
}
