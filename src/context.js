import {maybeClip} from "./options.js";

export function createContext(options = {}) {
  const {document = typeof window !== "undefined" ? window.document : undefined, clip} = options;
  return {document, clip: maybeClip(clip)};
}
