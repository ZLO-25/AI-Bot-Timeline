import { useCallback, useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import { TODAY_YEAR, type Milestone } from "@/data/milestones";

/** 還沒到的年份在圖上只占正常寬度的三分之一。到了那一天就恢復。 */
const FUTURE_SCALE = 1 / 3;

function calendarYear(date: Date) {
  const y = date.getFullYear();
  const start = Date.UTC(y, 0, 1);
  const end = Date.UTC(y + 1, 0, 1);
  const t = Date.UTC(y, date.getMonth(), date.getDate());
  return y + (t - start) / (end - start);
}

function compress(year: number, today: number) {
  if (year <= today) return year;
  return today + (year - today) * FUTURE_SCALE;
}

function expand(x: number, today: number) {
  if (x <= today) return x;
  return today + (x - today) / FUTURE_SCALE;
}

export type PlotPoint = Milestone & { year: number; impact: number };

type DotProps = {
  cx?: number;
  cy?: number;
  payload?: PlotPoint;
};

type Props = {
  points: PlotPoint[];
  from: number;
  to: number;
  selectedId: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
};

function yearTicks(from: number, to: number): number[] {
  if (to - from > 50) {
    return [1950, 1970, 1990, 2010, 2030].filter((y) => y >= from && y <= to);
  }
  const span = to - from;
  const step = span > 12 ? 2 : 1;
  const ticks: number[] = [];
  const first = Math.ceil(from / step) * step;
  for (let y = first; y <= to; y += step) ticks.push(y);
  return ticks.length > 0 ? ticks : [from];
}

export function ImpactChart({ points, from, to, selectedId, onSelect, onHover }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [today, setToday] = useState(TODAY_YEAR);
  const [spots, setSpots] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    setToday(calendarYear(new Date()));
  }, []);
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

  const drawn = [...points]
    .map((point) => ({ ...point, plotX: compress(point.year, today) }))
    .sort((a, b) => a.year - b.year || a.id.localeCompare(b.id));
  const labels = placeLabels(drawn, spots, selectedId, size.w, size.h);

  return (
    <div ref={frame} className="chart-frame relative">
      {size.w > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 28, right: 12, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis
              type="number"
              dataKey="plotX"
              domain={[compress(from, today), compress(to + 1, today)]}
              ticks={yearTicks(from, to).map((year) => compress(year, today))}
              tickFormatter={(v: number) => String(Math.round(expand(v, today)))}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-line)" }}
              tickLine={false}
              height={28}
              allowDataOverflow
            />
            <YAxis
              type="number"
              dataKey="impact"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              width={32}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine y={40} stroke="var(--color-line)" strokeDasharray="3 4" />
            <ReferenceLine y={70} stroke="var(--color-amber-dim)" strokeDasharray="3 4" />
            {to >= today ? (
              <ReferenceArea
                x1={compress(Math.max(from, today), today)}
                x2={compress(to + 1, today)}
                fill="var(--color-sage)"
                fillOpacity={0.12}
                ifOverflow="hidden"
              />
            ) : null}
            {from <= today && to >= today ? (
              <ReferenceLine
                x={today}
                stroke="var(--color-sage)"
                strokeDasharray="3 4"
                label={{
                  value: "今天",
                  fill: "var(--color-sage)",
                  fontSize: 12,
                  position: "insideBottomRight",
                }}
              />
            ) : null}
            <Scatter
              data={drawn}
              isAnimationActive={false}
              shape={(raw: DotProps) => (
                <EventDot
                  cx={raw.cx}
                  cy={raw.cy}
                  payload={raw.payload}
                  compact={false}
                  onPlace={onPlace}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onHover={onHover}
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
      {points.length === 0 ? (
        <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted">
          這個範圍裡沒有節點。把時間拉寬，或改回全部。
        </p>
      ) : null}
    </div>
  );
}

function EventDot({
  cx,
  cy,
  payload,
  selectedId,
  onSelect,
  onHover,
  onPlace,
}: DotProps & {
  compact: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onPlace?: (id: string, x: number, y: number) => void;
}) {
  useEffect(() => {
    if (cx == null || cy == null || !payload) return;
    onPlace?.(payload.id, cx, cy);
  }, [cx, cy, payload, onPlace]);
  if (cx == null || cy == null || !payload) return null;
  const selected = payload.id === selectedId;
  const forecast = Boolean(payload.forecast);
  const fill = forecast ? "var(--color-sage)" : "var(--color-amber)";
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
      >
        <title>
          {payload.name} · {payload.impact}
          {forecast ? " · 預測" : ""}
        </title>
      </circle>
    </g>
  );
}

type Anchor = "start" | "middle" | "end";
type Box = { l: number; t: number; r: number; b: number };

function textWidth(text: string) {
  let width = 0;
  for (const ch of text) width += ch.charCodeAt(0) > 255 ? 16 : 7.2;
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
  points: PlotPoint[],
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
    const text = point.chartLabel;
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
