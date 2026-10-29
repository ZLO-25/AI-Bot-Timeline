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

function money(value: number) {
  if (value < 1) return `$${Number(value.toFixed(2))}`;
  return `$${value}`;
}

function ModelDot({
  cx,
  cy,
  payload,
  onSelect,
  onHover,
  onPlace,
  overlay,
}: DotProps & Pick<Props, "onSelect" | "onHover"> & { overlay?: boolean; onPlace?: (id: string, x: number, y: number) => void }) {
  useEffect(() => {
    if (overlay || cx == null || cy == null || !payload) return;
    onPlace?.(payload.id, cx, cy);
  }, [cx, cy, overlay, payload, onPlace]);
  if (cx == null || cy == null || !payload) return null;
  const open = payload.weights === "權重公開";
  const fill = open ? "var(--color-sage)" : "var(--color-amber)";
  return (
    <g pointerEvents={overlay ? "none" : undefined}>
      {overlay ? null : (
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
      )}
      {payload.frontier ? (
        <circle cx={cx} cy={cy} r={11} fill="none" stroke="var(--color-sage)" strokeDasharray="2 2" pointerEvents="none" />
      ) : null}
      <circle
        cx={cx}
        cy={cy}
        r={overlay ? 7 : 5}
        fill={fill}
        stroke={overlay ? "var(--color-fg)" : "var(--color-bg)"}
        strokeWidth={2}
        pointerEvents="none"
      />
    </g>
  );
}

export function ModelChart({ points, selectedId, onSelect, onHover }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

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
  const selected = ordered.filter((point) => point.id === selectedId);
  const [spots, setSpots] = useState<Record<string, { x: number; y: number }>>({});
  const onPlace = useCallback((id: string, x: number, y: number) => {
    setSpots((prev) => {
      const current = prev[id];
      if (current && Math.abs(current.x - x) < 0.5 && Math.abs(current.y - y) < 0.5) return prev;
      return { ...prev, [id]: { x, y } };
    });
  }, []);
  const labels = placeLabels(ordered, spots, selectedId, size.w, size.h);

  return (
    <div ref={frame} className="model-chart relative">
      {size.w > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 36, right: 12, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="var(--color-line)" />
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
                  onSelect={onSelect}
                  onHover={onHover}
                  onPlace={onPlace}
                />
              )}
            />
            <Scatter
              data={selected}
              isAnimationActive={false}
              shape={(raw: DotProps) => (
                <ModelDot
                  cx={raw.cx}
                  cy={raw.cy}
                  payload={raw.payload}
                  onSelect={onSelect}
                  onHover={onHover}
                  overlay
                />
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      ) : null}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {labels.map((label) => (
          <g key={label.id}>
            <line x1={label.x1} y1={label.y1} x2={label.x2} y2={label.y2} stroke="var(--color-faint)" strokeWidth={1} />
            <text
              x={label.x}
              y={label.y}
              textAnchor={label.anchor}
              fill={label.selected ? "var(--color-fg)" : "var(--color-muted)"}
              fontSize={11}
              fontWeight={label.selected ? 650 : 500}
            >
              {label.text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

type Anchor = "start" | "middle" | "end";
type Box = { l: number; t: number; r: number; b: number };

function textWidth(text: string) {
  let width = 0;
  for (const ch of text) width += ch.charCodeAt(0) > 255 ? 11 : 6.2;
  return width;
}

function boxOf(x: number, y: number, width: number, anchor: Anchor): Box {
  const left = anchor === "start" ? x : anchor === "end" ? x - width : x - width / 2;
  return { l: left, t: y - 12, r: left + width, b: y + 3 };
}

function boxesHit(a: Box, b: Box) {
  return a.l < b.r + 3 && a.r > b.l - 3 && a.t < b.b + 2 && a.b > b.t - 2;
}

function hitsDot(box: Box, dots: Array<{ x: number; y: number }>) {
  return dots.some((dot) => {
    const x = Math.max(box.l, Math.min(dot.x, box.r));
    const y = Math.max(box.t, Math.min(dot.y, box.b));
    return (dot.x - x) ** 2 + (dot.y - y) ** 2 < 13 * 13;
  });
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
  const order = [...points].sort((a, b) => (a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0));
  const placed: Box[] = [];
  const dirs: Array<{ dx: number; dy: number; anchor: Anchor }> = [
    { dx: 0, dy: -1, anchor: "middle" },
    { dx: 0, dy: 1, anchor: "middle" },
    { dx: 1, dy: 0, anchor: "start" },
    { dx: -1, dy: 0, anchor: "end" },
    { dx: 1, dy: -0.7, anchor: "start" },
    { dx: -1, dy: -0.7, anchor: "end" },
    { dx: 1, dy: 0.7, anchor: "start" },
    { dx: -1, dy: 0.7, anchor: "end" },
  ];
  return order.flatMap((point) => {
    const dot = dots.find((item) => item.id === point.id);
    if (!dot) return [];
    const text = point.chartLabel ?? point.name;
    const tw = textWidth(text);
    let choice = { x: dot.x + 16, y: dot.y - 16, anchor: "start" as Anchor, box: boxOf(dot.x + 16, dot.y - 16, tw, "start") };
    let found = false;
    for (const dist of [22, 38, 56, 76, 98]) {
      for (const dir of dirs) {
        const x = dot.x + dir.dx * dist;
        const y = dot.y + dir.dy * dist;
        const box = boxOf(x, y, tw, dir.anchor);
        if (box.l < 2 || box.r > width - 2 || box.t < 8 || box.b > height - 2) continue;
        if (hitsDot(box, dots) || placed.some((other) => boxesHit(box, other))) continue;
        choice = { x, y, anchor: dir.anchor, box };
        found = true;
        break;
      }
      if (found) break;
    }
    if (!found) {
      for (const dist of [112, 136]) {
        for (const dir of dirs) {
          const x = dot.x + dir.dx * dist;
          const y = dot.y + dir.dy * dist;
          const box = boxOf(x, y, tw, dir.anchor);
          if (box.l < 2 || box.r > width - 2 || box.t < 8 || box.b > height - 2) continue;
          if (hitsDot(box, dots)) continue;
          choice = { x, y, anchor: dir.anchor, box };
          found = true;
          break;
        }
        if (found) break;
      }
    }
    if (!found) return [];
    placed.push(choice.box);
    return [
      {
        id: point.id,
        text,
        x: choice.x,
        y: choice.y,
        anchor: choice.anchor,
        selected: point.id === selectedId,
        x1: dot.x + (choice.x > dot.x ? 7 : -7),
        y1: dot.y,
        x2: choice.anchor === "end" ? choice.box.r : choice.box.l,
        y2: (choice.box.t + choice.box.b) / 2,
      },
    ];
  });
}
