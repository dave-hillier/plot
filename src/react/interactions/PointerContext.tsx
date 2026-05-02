import React, {createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject} from "react";
import {findNearest} from "./usePointer.js";

// PointerRoot tracks which datum (if any) is currently selected by the
// pointer in a Plot, and exposes that selection to descendant components
// (e.g., Tip) via PointerContext. This replaces the imperative D3 event
// subscription in src/interactions/pointer.js for the React entrypoint.
//
// Pointer-driven marks (Tip and the sub-marks of Crosshair) register a
// channel set with the provider; on each pointermove, the provider runs
// findNearest() per registered consumer, picks the closest across all
// registrations, and updates the selected index. Sticky toggle, RAF
// coalescing across facets, and pointer-leave clearing mirror pointer.js's
// behavior.

export interface PointerRegistration {
  // Stable id for this registration (a per-mark useId or constructor key).
  id: string;
  // Index of data rows this consumer can select from.
  index: ArrayLike<number>;
  // Channel values (typically the mark's resolved values, with x/y arrays).
  values: Record<string, any>;
  // X/Y weighting (kx/ky from pointerK) — defaults to 1/1 (xy mode).
  kx?: number;
  ky?: number;
  // Maximum selection radius in pixels.
  maxRadius?: number;
  // Facet id (from index.fi); null when unfaceted.
  fi?: number | null;
}

export interface PointerSelection {
  // The selected datum index (within `index`) or null if no hover.
  i: number | null;
  sticky: boolean;
  // The facet id of the current selection (null when unfaceted).
  fi: number | null;
}

interface PointerContextValue {
  register: (reg: PointerRegistration) => () => void;
  // Returns the current selection for a given registration id, or null.
  selectionFor: (id: string) => PointerSelection | null;
}

export const PointerContext = createContext<PointerContextValue | null>(null);

export function usePointerContext(): PointerContextValue | null {
  return useContext(PointerContext);
}

interface PointerRootProps {
  svgRef: RefObject<SVGSVGElement | null>;
  children?: ReactNode;
}

interface InternalState {
  // The winning registration id and index, plus its facet.
  winnerId: string | null;
  winnerI: number | null;
  winnerFi: number | null;
  sticky: boolean;
}

// Wraps the plot's <svg> with a context provider; subscribes to pointer
// events on the imperatively-attached svg ref and exposes the current
// selection via context. Renders no DOM of its own.
export function PointerRoot({svgRef, children}: PointerRootProps) {
  const [state, setState] = useState<InternalState>({winnerId: null, winnerI: null, winnerFi: null, sticky: false});
  const registrations = useRef<Map<string, PointerRegistration>>(new Map());
  const rafRef = useRef<number>(0);
  const stickyRef = useRef(false);
  stickyRef.current = state.sticky;

  const register = (reg: PointerRegistration) => {
    registrations.current.set(reg.id, reg);
    return () => {
      registrations.current.delete(reg.id);
    };
  };

  const selectionFor = (id: string): PointerSelection | null => {
    if (state.winnerId !== id) return null;
    return {i: state.winnerI, sticky: state.sticky, fi: state.winnerFi};
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const computeWinner = (px: number, py: number) => {
      let bestId: string | null = null;
      let bestI: number | null = null;
      let bestFi: number | null = null;
      let bestDist = Infinity;
      for (const reg of registrations.current.values()) {
        const idx = Array.isArray(reg.index) ? (reg.index as number[]) : Array.from(reg.index);
        if (!idx.length) continue;
        const mode = (reg.kx ?? 1) === 1 && (reg.ky ?? 1) === 1 ? "xy" : (reg.ky ?? 1) < 1 ? "x" : "y";
        const i = findNearest(idx, reg.values, px, py, mode as "xy" | "x" | "y");
        if (i == null) continue;
        const X = reg.values?.x;
        const Y = reg.values?.y;
        const dx = X?.[i] != null ? (X[i] as number) - px : 0;
        const dy = Y?.[i] != null ? (Y[i] as number) - py : 0;
        const d = dx * dx + dy * dy;
        const max = (reg.maxRadius ?? 40) ** 2;
        if (d > max) continue;
        if (d < bestDist) {
          bestDist = d;
          bestId = reg.id;
          bestI = i;
          bestFi = reg.fi ?? null;
        }
      }
      return bestId == null ? null : {id: bestId, i: bestI as number, fi: bestFi};
    };

    const onMove = (event: PointerEvent) => {
      if (stickyRef.current) return;
      if (event.pointerType === "mouse" && event.buttons === 1) return;
      const rect = svg.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const w = computeWinner(px, py);
        setState((prev) => {
          if (w == null) {
            if (prev.winnerId == null) return prev;
            return {winnerId: null, winnerI: null, winnerFi: null, sticky: prev.sticky};
          }
          if (prev.winnerId === w.id && prev.winnerI === w.i && prev.winnerFi === w.fi) return prev;
          return {winnerId: w.id, winnerI: w.i, winnerFi: w.fi, sticky: prev.sticky};
        });
      });
    };

    const onLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (stickyRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      setState((prev) => (prev.winnerId == null ? prev : {winnerId: null, winnerI: null, winnerFi: null, sticky: false}));
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      setState((prev) => {
        if (prev.sticky) return {winnerId: null, winnerI: null, winnerFi: null, sticky: false};
        if (prev.winnerId == null) return prev;
        return {...prev, sticky: true};
      });
    };

    svg.addEventListener("pointerenter", onMove);
    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerdown", onDown);
    svg.addEventListener("pointerleave", onLeave);
    return () => {
      svg.removeEventListener("pointerenter", onMove);
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerdown", onDown);
      svg.removeEventListener("pointerleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [svgRef]);

  return (
    <PointerContext.Provider value={{register, selectionFor}}>{children}</PointerContext.Provider>
  );
}
