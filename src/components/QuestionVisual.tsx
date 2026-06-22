import React from "react";
import type { VisualData } from "@/data/questions/types";

// Parse "shape:fill:rotation" string
function parseShape(s: string) {
  const parts = s.split(":");
  return { shape: parts[0], fill: parts[1] || "f", rotation: parseInt(parts[2] || "0") };
}

function getFill(f: string) {
  switch (f) {
    case "f": return "#333";
    case "e": return "none";
    case "g": return "#aaa";
    case "s": return "url(#stripes)";
    case "d": return "url(#dots)";
    default: return "#333";
  }
}
function getStroke(f: string) {
  return f === "e" || f === "s" || f === "d" ? "#333" : "none";
}

interface ShapeProps {
  shape: string;
  fill: string;
  rotation: number;
  x: number;
  y: number;
  size: number;
}

function ShapeSVG({ shape, fill, rotation, x, y, size }: ShapeProps) {
  const fc = getFill(fill);
  const sc = getStroke(fill);
  const sw = 2;
  const t = rotation ? `rotate(${rotation} ${x} ${y})` : undefined;
  const s = size;

  switch (shape) {
    case "circle":
      return <circle cx={x} cy={y} r={s * 0.8} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
    case "square":
      return <rect x={x - s * 0.7} y={y - s * 0.7} width={s * 1.4} height={s * 1.4} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
    case "triangle":
      return <polygon points={`${x},${y - s} ${x + s * 0.87},${y + s * 0.5} ${x - s * 0.87},${y + s * 0.5}`} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
    case "diamond":
      return <polygon points={`${x},${y - s} ${x + s * 0.7},${y} ${x},${y + s} ${x - s * 0.7},${y}`} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
    case "hexagon": {
      const pts = [0, 1, 2, 3, 4, 5].map(i => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return `${x + s * 0.85 * Math.cos(a)},${y + s * 0.85 * Math.sin(a)}`;
      }).join(" ");
      return <polygon points={pts} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
    }
    case "star": {
      const pts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const r = i % 2 === 0 ? s * 0.85 : s * 0.4;
        return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
      }).join(" ");
      return <polygon points={pts} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
    }
    case "cross":
      return (
        <g transform={t}>
          <rect x={x - s * 0.25} y={y - s * 0.8} width={s * 0.5} height={s * 1.6} fill={fc} stroke={sc} strokeWidth={sw} />
          <rect x={x - s * 0.8} y={y - s * 0.25} width={s * 1.6} height={s * 0.5} fill={fc} stroke={sc} strokeWidth={sw} />
        </g>
      );
    case "pentagon": {
      const pts = [0, 1, 2, 3, 4].map(i => {
        const a = (2 * Math.PI / 5) * i - Math.PI / 2;
        return `${x + s * 0.85 * Math.cos(a)},${y + s * 0.85 * Math.sin(a)}`;
      }).join(" ");
      return <polygon points={pts} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
    }
    case "arrow":
      return (
        <g transform={t}>
          <polygon points={`${x},${y - s} ${x + s * 0.6},${y} ${x + s * 0.25},${y} ${x + s * 0.25},${y + s * 0.7} ${x - s * 0.25},${y + s * 0.7} ${x - s * 0.25},${y} ${x - s * 0.6},${y}`} fill={fc} stroke={sc} strokeWidth={sw} />
        </g>
      );
    case "semicircle":
      return (
        <path d={`M ${x - s * 0.8} ${y} A ${s * 0.8} ${s * 0.8} 0 0 1 ${x + s * 0.8} ${y} Z`} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />
      );
    case "oval":
      return <ellipse cx={x} cy={y} rx={s * 0.9} ry={s * 0.55} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
    case "heart":
      return (
        <path d={`M ${x} ${y + s * 0.6} C ${x - s} ${y - s * 0.3} ${x - s * 0.5} ${y - s} ${x} ${y - s * 0.3} C ${x + s * 0.5} ${y - s} ${x + s} ${y - s * 0.3} ${x} ${y + s * 0.6} Z`} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />
      );
    case "trapezoid":
      return <polygon points={`${x - s * 0.5},${y - s * 0.6} ${x + s * 0.5},${y - s * 0.6} ${x + s * 0.85},${y + s * 0.6} ${x - s * 0.85},${y + s * 0.6}`} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
    case "parallelogram":
      return <polygon points={`${x - s * 0.5},${y - s * 0.5} ${x + s * 0.85},${y - s * 0.5} ${x + s * 0.5},${y + s * 0.5} ${x - s * 0.85},${y + s * 0.5}`} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
    case "rhombus":
      return <polygon points={`${x},${y - s * 0.9} ${x + s * 0.55},${y} ${x},${y + s * 0.9} ${x - s * 0.55},${y}`} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
    default:
      return <circle cx={x} cy={y} r={s * 0.8} fill={fc} stroke={sc} strokeWidth={sw} transform={t} />;
  }
}

function renderItem(encoded: string, x: number, y: number, size: number) {
  if (encoded === "?") {
    return (
      <text x={x} y={y + size * 0.35} textAnchor="middle" fontSize={size * 1.2} fontWeight="bold" fill="#666" fontFamily="sans-serif">?</text>
    );
  }
  const { shape, fill, rotation } = parseShape(encoded);
  return <ShapeSVG shape={shape} fill={fill} rotation={rotation} x={x} y={y} size={size} />;
}

// Pattern definitions for fills
function PatternDefs() {
  return (
    <defs>
      <pattern id="stripes" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#333" strokeWidth="2" />
      </pattern>
      <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="1.5" fill="#333" />
      </pattern>
    </defs>
  );
}

// ─── Layout: Sequence ───
function SequenceLayout({ visual }: { visual: VisualData }) {
  const items = [...visual.items, "?"];
  const w = items.length * 60;
  return (
    <svg viewBox={`0 0 ${w} 60`} className="w-full max-w-md h-16 mx-auto">
      <PatternDefs />
      {items.map((item, i) => (
        <g key={i}>
          {renderItem(item, 30 + i * 60, 30, 18)}
          {i < items.length - 1 && <text x={55 + i * 60} y={35} fontSize="14" fill="#999">→</text>}
        </g>
      ))}
    </svg>
  );
}

// ─── Layout: Odd One Out ───
function OddOneOutLayout({ visual }: { visual: VisualData }) {
  const items = visual.items;
  const w = items.length * 70;
  return (
    <svg viewBox={`0 0 ${w} 80`} className="w-full max-w-md h-20 mx-auto">
      <PatternDefs />
      {items.map((item, i) => (
        <g key={i}>
          {renderItem(item, 35 + i * 70, 35, 20)}
          <text x={35 + i * 70} y={72} textAnchor="middle" fontSize="12" fill="#666" fontFamily="sans-serif">
            {String.fromCharCode(65 + i)}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Layout: Pattern Grid ───
function PatternGridLayout({ visual }: { visual: VisualData }) {
  const cols = visual.cols || 3;
  const rows = Math.ceil(visual.items.length / cols);
  const cellSize = 60;
  const w = cols * cellSize;
  const h = rows * cellSize;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xs mx-auto" style={{ height: `${rows * 60}px`, maxHeight: "200px" }}>
      <PatternDefs />
      {visual.items.map((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = col * cellSize + cellSize / 2;
        const cy = row * cellSize + cellSize / 2;
        const display = i === visual.missing ? "?" : item;
        return (
          <g key={i}>
            <rect x={col * cellSize} y={row * cellSize} width={cellSize} height={cellSize} fill="none" stroke="#ddd" strokeWidth="1" />
            {renderItem(display, cx, cy, 16)}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Layout: Analogy ───
function AnalogyLayout({ visual }: { visual: VisualData }) {
  // items: [A, B, C], meaning A:B :: C:?
  return (
    <svg viewBox="0 0 340 60" className="w-full max-w-sm h-16 mx-auto">
      <PatternDefs />
      {renderItem(visual.items[0], 30, 30, 18)}
      <text x="65" y="36" fontSize="16" fill="#666" fontFamily="sans-serif">is to</text>
      {renderItem(visual.items[1], 120, 30, 18)}
      <text x="155" y="36" fontSize="16" fill="#666" fontFamily="sans-serif">as</text>
      {renderItem(visual.items[2], 200, 30, 18)}
      <text x="235" y="36" fontSize="16" fill="#666" fontFamily="sans-serif">is to</text>
      {renderItem("?", 290, 30, 18)}
    </svg>
  );
}

// ─── Layout: Mirror ───
function MirrorLayout({ visual }: { visual: VisualData }) {
  return (
    <svg viewBox="0 0 200 80" className="w-full max-w-xs h-20 mx-auto">
      <PatternDefs />
      {renderItem(visual.items[0], 50, 40, 22)}
      <line x1="100" y1="5" x2="100" y2="75" stroke="#aaa" strokeWidth="2" strokeDasharray="4 4" />
      <text x="100" y="14" textAnchor="middle" fontSize="10" fill="#999" fontFamily="sans-serif">mirror</text>
      {renderItem("?", 150, 40, 22)}
    </svg>
  );
}

// ─── Layout: Rotation ───
function RotationLayout({ visual }: { visual: VisualData }) {
  const angle = visual.items[1] || "90";
  return (
    <svg viewBox="0 0 220 80" className="w-full max-w-xs h-20 mx-auto">
      <PatternDefs />
      {renderItem(visual.items[0], 50, 40, 22)}
      <text x="110" y={38} textAnchor="middle" fontSize="12" fill="#666" fontFamily="sans-serif">↻ {angle}°</text>
      {renderItem("?", 170, 40, 22)}
    </svg>
  );
}

// ─── Layout: Counting ───
function CountingLayout({ visual }: { visual: VisualData }) {
  const items = visual.items;
  const cols = Math.ceil(Math.sqrt(items.length));
  const cellSize = 50;
  const w = cols * cellSize;
  const rows = Math.ceil(items.length / cols);
  const h = rows * cellSize;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xs mx-auto" style={{ maxHeight: "200px" }}>
      <PatternDefs />
      {items.map((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <g key={i}>{renderItem(item, col * cellSize + cellSize / 2, row * cellSize + cellSize / 2, 14)}</g>
        );
      })}
    </svg>
  );
}

// ─── Layout: Matching ───
function MatchingLayout({ visual }: { visual: VisualData }) {
  const items = visual.items;
  const w = items.length * 70;
  return (
    <svg viewBox={`0 0 ${w} 80`} className="w-full max-w-md h-20 mx-auto">
      <PatternDefs />
      {items.map((item, i) => (
        <g key={i}>
          {renderItem(item, 35 + i * 70, 35, 20)}
          <text x={35 + i * 70} y={72} textAnchor="middle" fontSize="12" fill="#666" fontFamily="sans-serif">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Main visual component ───
export function QuestionVisual({ visual }: { visual: VisualData }) {
  switch (visual.type) {
    case "sequence": return <SequenceLayout visual={visual} />;
    case "oddOneOut": return <OddOneOutLayout visual={visual} />;
    case "patternGrid": return <PatternGridLayout visual={visual} />;
    case "analogy": return <AnalogyLayout visual={visual} />;
    case "mirror": return <MirrorLayout visual={visual} />;
    case "rotation": return <RotationLayout visual={visual} />;
    case "counting": return <CountingLayout visual={visual} />;
    case "matching": return <MatchingLayout visual={visual} />;
    default: return null;
  }
}

// ─── Option shape (small inline visual) ───
export function OptionShapeVisual({ shapes }: { shapes: string[] }) {
  const w = shapes.length * 40;
  return (
    <svg viewBox={`0 0 ${w} 40`} className="h-8 w-auto">
      <PatternDefs />
      {shapes.map((s, i) => (
        <g key={i}>{renderItem(s, 20 + i * 40, 20, 12)}</g>
      ))}
    </svg>
  );
}

export default QuestionVisual;
