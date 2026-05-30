// Markers are resolved to canonical names here; the actual <marker> SVG defs
// are produced as JSX by markerToJSX (src/react/Markers.tsx) inline alongside
// the referencing path. Custom marker functions (user-supplied) are passed
// through unchanged but are not yet rendered by the JSX path.

export function markers(mark, {marker, markerStart = marker, markerMid = marker, markerEnd = marker} = {}) {
  mark.markerStart = maybeMarker(markerStart);
  mark.markerMid = maybeMarker(markerMid);
  mark.markerEnd = maybeMarker(markerEnd);
}

function maybeMarker(marker) {
  if (marker == null || marker === false) return null;
  if (marker === true) return "circle-fill";
  if (typeof marker === "function") return marker; // custom marker function
  const name = `${marker}`.toLowerCase();
  switch (name) {
    case "none":
      return null;
    case "circle":
      return "circle-fill";
    case "arrow":
    case "arrow-reverse":
    case "dot":
    case "circle-fill":
    case "circle-stroke":
    case "tick":
    case "tick-x":
    case "tick-y":
      return name;
  }
  throw new Error(`invalid marker: ${marker}`);
}
