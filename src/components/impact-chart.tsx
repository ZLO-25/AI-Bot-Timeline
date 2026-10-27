import { useEffect, useRef, useState } from "react";
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
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const apply = () => setWidth(el.clientWidth);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const compact = width < 720;
  const drawn = [...points].sort((a, b) => {
    if (a.id === selectedId) return 1;
    if (b.id === selectedId) return -1;
    return a.impact - b.impact;
  });

  return (
    <div ref={frame} className="chart-frame relative">
      {width > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 28, right: 12, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis
              type="number"
              dataKey="year"
              domain={[from, to + 1]}
              ticks={yearTicks(from, to)}
              tickFormatter={(v: number) => String(Math.round(v))}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-line)" }}
              tickLine={false}
              height={28}
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
            {to >= 2026 ? (
              <ReferenceArea
                x1={Math.max(from, TODAY_YEAR)}
                x2={to + 1}
                fill="var(--color-sage)"
                fillOpacity={0.12}
                ifOverflow="hidden"
              />
            ) : null}
            {from <= 2026 && to >= 2026 ? (
              <ReferenceLine
                x={TODAY_YEAR}
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
                  compact={compact || to - from > 20}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onHover={onHover}
                />
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      ) : null}
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
  compact,
  selectedId,
  onSelect,
  onHover,
}: DotProps & {
  compact: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  if (cx == null || cy == null || !payload) return null;
  const selected = payload.id === selectedId;
  const forecast = Boolean(payload.forecast);
  const r = 5 + (payload.impact / 100) * 6;
  const showLabel = selected || (!compact && payload.anchor);
  let place = payload.labelPlace ?? "above";
  if (place === "left" && cx < 108) place = "below";
  if (place === "above" && cy < 26) place = "below";

  let x = cx;
  let y = cy - r - 8;
  let anchor: "middle" | "end" = "middle";
  if (place === "below") y = cy + r + 14;
  if (place === "left") {
    x = cx - r - 8;
    y = cy + 4;
    anchor = "end";
  }
  const tone = forecast ? "var(--color-sage)" : "var(--color-amber)";
  const faded = forecast && !selected && payload.confidence === "低";

  return (
    <g>
      {selected ? (
        <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={tone} strokeWidth={1.5} />
      ) : null}
      <circle
        cx={cx}
        cy={cy}
        r={selected ? r + 1.5 : r}
        fill={forecast ? "transparent" : "var(--color-amber)"}
        stroke={forecast ? "var(--color-sage)" : "none"}
        strokeWidth={forecast ? 1.75 : 0}
        opacity={faded ? 0.72 : selected || !forecast ? 1 : 0.95}
      />
      <circle
        cx={cx}
        cy={cy}
        r={18}
        fill="transparent"
        className="cursor-pointer"
        onClick={() => onSelect(payload.id)}
        onPointerEnter={(event) => {
          if (event.pointerType === "touch") return;
          onHover(payload.id);
        }}
        onPointerLeave={() => onHover(null)}
      >
        <title>
          {payload.name} · {payload.impact}
          {forecast ? " · 預測" : ""}
        </title>
      </circle>
      {showLabel ? (
        <text
          x={x}
          y={y}
          textAnchor={anchor}
          fill={forecast ? "var(--color-sage)" : "var(--color-fg)"}
          fontSize={12}
          fontFamily="var(--font-sans)"
          fontWeight={selected ? 700 : 600}
        >
          {payload.chartLabel}
        </text>
      ) : null}
    </g>
  );
}
