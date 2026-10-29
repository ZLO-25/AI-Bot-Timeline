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

export type CostPoint = AaiiPoint & { frontier: boolean };

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
  overlay,
}: DotProps & Pick<Props, "onSelect" | "onHover"> & { overlay?: boolean }) {
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
      {overlay ? (
        <text
          x={payload.cost > 6 ? cx - 12 : cx + 12}
          y={cy - 8}
          textAnchor={payload.cost > 6 ? "end" : "start"}
          fill="var(--color-fg)"
          fontSize={12}
        >
          {payload.name}
        </text>
      ) : null}
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
    <div ref={frame} className="chart-frame relative">
      {width > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 28, right: 16, bottom: 8, left: 0 }}>
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
    </div>
  );
}
