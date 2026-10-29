import { useEffect, useRef, useState } from "react";
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
  selectedId,
  onSelect,
  onHover,
  overlay,
}: DotProps & Pick<Props, "selectedId" | "onSelect" | "onHover"> & { overlay?: boolean }) {
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
      {overlay ? null : (
        <g pointerEvents="none">
          <line
            x1={payload.cost > 4 ? cx - 6 : cx + 6}
            y1={cy}
            x2={payload.cost > 4 ? cx - 10 : cx + 10}
            y2={cy + (payload.labelDy ?? -12) - 4}
            stroke="var(--color-faint)"
            strokeWidth={1}
          />
          <text
            x={payload.cost > 4 ? cx - 12 : cx + 12}
            y={cy + (payload.labelDy ?? -12)}
            textAnchor={payload.cost > 4 ? "end" : "start"}
            fill={payload.id === selectedId ? "var(--color-fg)" : "var(--color-muted)"}
            fontSize={11}
            fontWeight={payload.id === selectedId ? 650 : 500}
          >
            {payload.chartLabel ?? payload.name}
          </text>
        </g>
      )}
    </g>
  );
}

export function ModelChart({ points, selectedId, onSelect, onHover }: Props) {
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

  const ordered = [...points].sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id));
  const selected = ordered.filter((point) => point.id === selectedId);

  return (
    <div ref={frame} className="model-chart relative">
      {width > 0 ? (
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
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onHover={onHover}
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
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onHover={onHover}
                  overlay
                />
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
