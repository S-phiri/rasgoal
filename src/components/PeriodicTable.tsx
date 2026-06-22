import { useState } from "react";
import elementsData from "@/data/periodic-table.json";

interface Element {
  number: number;
  symbol: string;
  name: string;
  atomic_mass: number;
  category: string;
  period: number;
  group: number | null;
  xpos: number;
  ypos: number;
  discovered_by: string | null;
  melt: number | null;
  boil: number | null;
  shells: number[];
  electron_configuration_semantic: string | null;
}

const elements = elementsData as Element[];

const categoryColors: Record<string, string> = {
  "alkali metal": "bg-pink-200 text-pink-900 border-pink-300",
  "alkaline earth metal": "bg-orange-200 text-orange-900 border-orange-300",
  "transition metal": "bg-amber-200 text-amber-900 border-amber-300",
  "post-transition metal": "bg-slate-300 text-slate-900 border-slate-400",
  "metalloid": "bg-teal-200 text-teal-900 border-teal-300",
  "diatomic nonmetal": "bg-blue-200 text-blue-900 border-blue-300",
  "polyatomic nonmetal": "bg-blue-200 text-blue-900 border-blue-300",
  "noble gas": "bg-purple-200 text-purple-900 border-purple-300",
  "lanthanide": "bg-yellow-200 text-yellow-900 border-yellow-300",
  "actinide": "bg-rose-200 text-rose-900 border-rose-300",
  "unknown, probably transition metal": "bg-gray-200 text-gray-700 border-gray-300",
  "unknown, probably post-transition metal": "bg-gray-200 text-gray-700 border-gray-300",
  "unknown, probably metalloid": "bg-gray-200 text-gray-700 border-gray-300",
  "unknown, predicted to be noble gas": "bg-gray-200 text-gray-700 border-gray-300",
  "unknown, but predicted to be an alkali metal": "bg-gray-200 text-gray-700 border-gray-300",
};

const legend = [
  { label: "Alkali metals", cls: "bg-pink-200" },
  { label: "Alkaline earth", cls: "bg-orange-200" },
  { label: "Transition", cls: "bg-amber-200" },
  { label: "Post-transition", cls: "bg-slate-300" },
  { label: "Metalloids", cls: "bg-teal-200" },
  { label: "Nonmetals", cls: "bg-blue-200" },
  { label: "Noble gases", cls: "bg-purple-200" },
  { label: "Lanthanides", cls: "bg-yellow-200" },
  { label: "Actinides", cls: "bg-rose-200" },
];

const PeriodicTable = () => {
  const [hovered, setHovered] = useState<Element | null>(null);

  // Find element at grid position (xpos 1-18, ypos 1-10 with lanthanides=9, actinides=10)
  const at = (x: number, y: number) =>
    elements.find((e) => e.xpos === x && e.ypos === y) || null;

  const renderCell = (x: number, y: number, key: string) => {
    const el = at(x, y);
    if (!el) return <div key={key} />;
    const colorClass = categoryColors[el.category] || "bg-gray-100 text-gray-800 border-gray-300";
    return (
      <button
        key={key}
        type="button"
        onMouseEnter={() => setHovered(el)}
        onFocus={() => setHovered(el)}
        onClick={() => setHovered(el)}
        className={`relative aspect-square rounded-sm border text-center transition-transform hover:scale-110 hover:z-10 hover:shadow-md ${colorClass}`}
        aria-label={`${el.name} (${el.symbol})`}
      >
        <span className="absolute top-0 left-0.5 text-[7px] sm:text-[8px] leading-none font-medium opacity-80">
          {el.number}
        </span>
        <span className="block mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] md:text-sm font-display font-bold leading-none">
          {el.symbol}
        </span>
      </button>
    );
  };


  // Main table 18 cols x 7 rows + separator + 2 series rows
  const mainRows = [1, 2, 3, 4, 5, 6, 7];
  const seriesRows = [8, 9]; // ypos 8 = lanthanides, 9 = actinides in this dataset
  // The Bowserinator dataset uses ypos 8 for La series, 9 for Ac series

  return (
    <div className="w-full">
      {/* Always-visible detail panel (works on mobile + desktop) */}
      <div className={`mb-3 rounded-md border-2 p-3 shadow-sm min-h-[110px] transition-colors ${hovered ? (categoryColors[hovered.category] || "bg-white border-gray-300") : "bg-muted/30 border-border"}`}>
        {hovered ? (
          <div className="flex gap-3 sm:gap-4">
            <div className="flex flex-col justify-between min-w-[64px] sm:min-w-[80px]">
              <div className="text-xs font-medium opacity-80">{hovered.number}</div>
              <div className="font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-none">{hovered.symbol}</div>
              <div className="text-xs opacity-80">{hovered.atomic_mass}</div>
            </div>
            <div className="flex-1 text-[11px] sm:text-xs space-y-0.5 leading-tight">
              <div className="font-display font-bold text-sm sm:text-base uppercase tracking-wide mb-1">
                {hovered.name}
              </div>
              {hovered.discovered_by && (
                <div><span className="opacity-70">Discovered</span> <span className="font-medium">{hovered.discovered_by}</span></div>
              )}
              {hovered.melt != null && (
                <div><span className="opacity-70">Melting Point</span> <span className="font-medium">{hovered.melt} K | {(hovered.melt - 273.15).toFixed(0)} °C</span></div>
              )}
              {hovered.boil != null && (
                <div><span className="opacity-70">Boiling Point</span> <span className="font-medium">{hovered.boil} K | {(hovered.boil - 273.15).toFixed(0)} °C</span></div>
              )}
              {hovered.shells && (
                <div><span className="opacity-70">Electrons per shell</span> <span className="font-medium">{hovered.shells.join(", ")}</span></div>
              )}
              {hovered.electron_configuration_semantic && (
                <div><span className="opacity-70">Config</span> <span className="font-medium">{hovered.electron_configuration_semantic}</span></div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
            Tap or hover any element to see its full details.
          </p>
        )}
      </div>

      {/* Horizontally scrollable grid for small screens */}
      <div className="overflow-x-auto -mx-3 px-3 pb-2">
        <div className="min-w-[640px] sm:min-w-0">
          {/* Header row with group numbers */}
          <div className="grid gap-[2px] mb-1" style={{ gridTemplateColumns: "minmax(28px,auto) repeat(18, minmax(0,1fr))" }}>
            <div className="text-[8px] text-muted-foreground self-end pr-1 text-right leading-tight">Group→<br/>Period↓</div>
            {Array.from({ length: 18 }, (_, i) => (
              <div key={`g${i + 1}`} className="text-[8px] sm:text-[9px] text-muted-foreground text-center self-end">
                {i + 1}
              </div>
            ))}
          </div>

          {mainRows.map((y) => (
            <div
              key={`r${y}`}
              className="grid gap-[2px] mb-[2px]"
              style={{ gridTemplateColumns: "minmax(28px,auto) repeat(18, minmax(0,1fr))" }}
            >
              <div className="text-[9px] sm:text-[10px] text-muted-foreground self-center text-right pr-1">{y}</div>
              {Array.from({ length: 18 }, (_, i) => renderCell(i + 1, y, `c${y}-${i + 1}`))}
            </div>
          ))}

          {/* Lanthanides / Actinides */}
          <div className="mt-3 space-y-[2px]">
            {seriesRows.map((y, idx) => (
              <div
                key={`s${y}`}
                className="grid gap-[2px]"
                style={{ gridTemplateColumns: "minmax(28px,auto) repeat(18, minmax(0,1fr))" }}
              >
                <div className="text-[8px] sm:text-[9px] text-muted-foreground self-center text-right pr-1 whitespace-nowrap">
                  {idx === 0 ? "* La" : "** Ac"}
                </div>
                {Array.from({ length: 18 }, (_, i) => renderCell(i + 1, y, `s${y}-${i + 1}`))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-4 text-[10px]">
        {legend.map((l) => (
          <div key={l.label} className="flex items-center gap-1">
            <span className={`inline-block w-3 h-3 rounded-sm border border-black/10 ${l.cls}`} />
            <span className="text-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeriodicTable;

