import { useCallback, useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import type { AaiiPoint } from "@/data/models";

export type CostPoint = AaiiPoint & { frontier: boolean; labelDy: number };

type DotProps = {
  cx?: number;
  cy?: number;
  payload?: CostPoint;
};

type Props = {
  points: CostPoint[];
  selectedId: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
};

const SHORT: Record<string, string> = {
  carbon: "Carbon",
  astra: "Astra",
  sol: "Sol",
  sonnet55: "Sonnet 5.5",
  terra: "Terra",
  argon: "Argon",
  fable: "Fable",
  kimi31: "Kimi K3.1",
  muse: "Muse",
  haiku: "Haiku",
  spark13: "Spark 1.3",
  grok47: "Grok 4.7",
  qwen38: "Qwen3.8",
  dsv41: "V4.1",
  glm53: "GLM-5.3",
  gem38: "Flash",
  mimo: "MiMo Pro",
  minimax: "MiniMax",
  step5: "Step 5",
  ling: "Ling",
  luna: "Luna",
  "mimo-flash": "MiMo Flash",
  "spark-open": "Spark Open",
  mistral4: "Mistral",
};

function money(value: number) {
  if (value < 1) return `$${Number(value.toFixed(2))}`;
  return `$${value}`;
}

function labelOf(point: CostPoint) {
  return point.chartLabel ?? SHORT[point.id] ?? point.name;
}

function ModelDot({
  cx,
  cy,
  payload,
  selectedId,
  onSelect,
  onHover,
  onPlace,
}: DotProps & Pick<Props, "selectedId" | "onSelect" | "onHover"> & { onPlace?: (id: string, x: number, y: number) => void }) {
  useEffect(() => {
    if (cx == null || cy == null || !payload) return;
    onPlace?.(payload.id, cx, cy);
  }, [cx, cy, payload, onPlace]);
  if (cx == null || cy == null || !payload) return null;
  const selected = payload.id === selectedId;
  const open = payload.weights === "權重公開";
  const fill = open ? "var(--color-sage)" : "var(--color-amber)";
  const r = 6;
  return (
    <g>
      {selected ? <circle cx={cx} cy={cy} r={r + 7} fill="none" stroke={fill} strokeWidth={1.5} /> : null}
      <circle cx={cx} cy={cy} r={selected ? r + 1 : r} fill={fill} />
      <circle
        cx={cx}
        cy={cy}
        r={16}
        fill="transparent"
        style={{ cursor: "pointer" }}
        onPointerEnter={(event) => {
          if (event.pointerType === "touch") return;
          onHover(payload.id);
        }}
        onPointerLeave={() => onHover(null)}
        onClick={() => onSelect(payload.id)}
      />
    </g>
  );
}

export function ModelChart({ points, selectedId, onSelect, onHover }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [spots, setSpots] = useState<Record<string, { x: number; y: number }>>({});
  const onPlace = useCallback((id: string, x: number, y: number) => {
    setSpots((prev) => {
      const current = prev[id];
      if (current && Math.abs(current.x - x) < 0.5 && Math.abs(current.y - y) < 0.5) return prev;
      return { ...prev, [id]: { x, y } };
    });
  }, []);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const apply = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ordered = [...points].sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id));
  const labels = placeLabels(ordered, spots, selectedId, size.w, size.h);

  return (
    <div ref={frame} className="model-chart relative">
      {size.w > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 28, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis
              type="number"
              dataKey="cost"
              scale="log"
              domain={[0.08, 16]}
              ticks={[0.1, 0.5, 1, 5, 10]}
              tickFormatter={money}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-line)" }}
              tickLine={false}
              height={28}
              allowDataOverflow
            />
            <YAxis
              type="number"
              dataKey="aaii"
              domain={[20, 65]}
              ticks={[25, 35, 45, 55]}
              width={36}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Scatter
              data={ordered}
              isAnimationActive={false}
              shape={(raw: DotProps) => (
                <ModelDot
                  cx={raw.cx}
                  cy={raw.cy}
                  payload={raw.payload}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onHover={onHover}
                  onPlace={onPlace}
                />
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      ) : null}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {labels.map((label) => (
          <text
            key={label.id}
            x={label.x}
            y={label.y}
            textAnchor={label.anchor}
            fill={label.selected ? "var(--color-fg)" : "var(--color-muted)"}
            fontSize={12}
            fontFamily="var(--font-sans)"
            fontWeight={label.selected ? 700 : 600}
          >
            {label.text}
          </text>
        ))}
      </svg>
    </div>
  );
}

type Anchor = "start" | "middle" | "end";
type Box = { l: number; t: number; r: number; b: number };

function textWidth(text: string) {
  let width = 0;
  for (const ch of text) width += ch.charCodeAt(0) > 255 ? 13 : 7.2;
  return width;
}

function boxOf(x: number, y: number, width: number, anchor: Anchor): Box {
  const left = anchor === "start" ? x : anchor === "end" ? x - width : x - width / 2;
  return { l: left, t: y - 12, r: left + width, b: y + 3 };
}

function overlapArea(a: Box, b: Box) {
  const w = Math.min(a.r, b.r) - Math.max(a.l, b.l);
  const h = Math.min(a.b, b.b) - Math.max(a.t, b.t);
  return w > 0 && h > 0 ? w * h : 0;
}

function dotPenalty(box: Box, dots: Array<{ x: number; y: number }>) {
  return dots.reduce((sum, dot) => {
    const x = Math.max(box.l, Math.min(dot.x, box.r));
    const y = Math.max(box.t, Math.min(dot.y, box.b));
    const gap = Math.hypot(dot.x - x, dot.y - y);
    return gap < 10 ? sum + (10 - gap) * 40 : sum;
  }, 0);
}

function placeLabels(
  points: CostPoint[],
  spots: Record<string, { x: number; y: number }>,
  selectedId: string,
  width: number,
  height: number,
) {
  const dots = points.flatMap((point) => {
    const spot = spots[point.id];
    return spot ? [{ ...spot, id: point.id }] : [];
  });
  if (dots.length === 0 || width === 0) return [];
  const slots: Array<{ dx: number; dy: number; anchor: Anchor }> = [
    { dx: 0, dy: -16, anchor: "middle" },
    { dx: 0, dy: 18, anchor: "middle" },
    { dx: 12, dy: 4, anchor: "start" },
    { dx: -12, dy: 4, anchor: "end" },
    { dx: 14, dy: -14, anchor: "start" },
    { dx: -14, dy: -14, anchor: "end" },
    { dx: 14, dy: 16, anchor: "start" },
    { dx: -14, dy: 16, anchor: "end" },
  ];
  const order = [...points].sort((a, b) => (a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0));
  const placed: Box[] = [];
  return order.flatMap((point) => {
    const dot = dots.find((item) => item.id === point.id);
    if (!dot) return [];
    const text = labelOf(point);
    const tw = textWidth(text);
    let clean: { x: number; y: number; anchor: Anchor; box: Box; dist: number } | null = null;
    for (const slot of slots) {
      const x = dot.x + slot.dx;
      const y = dot.y + slot.dy;
      const box = boxOf(x, y, tw, slot.anchor);
      if (box.l < 4 || box.r > width - 4 || box.t < 14 || box.b > height - 6) continue;
      const penalty = dotPenalty(box, dots) + placed.reduce((sum, other) => sum + overlapArea(box, other), 0);
      if (penalty > 0) continue;
      const dist = Math.hypot(slot.dx, slot.dy);
      if (!clean || dist < clean.dist) clean = { x, y, anchor: slot.anchor, box, dist };
    }
    if (!clean) return [];
    placed.push(clean.box);
    return [{ id: point.id, text, x: clean.x, y: clean.y, anchor: clean.anchor, selected: point.id === selectedId }];
  });
}
