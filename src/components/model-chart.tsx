import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import { TODAY_YEAR } from "@/data/milestones";
import type { LabModel } from "@/data/models";

export type ModelPoint = LabModel & { year: number; lane: number };

type DotProps = {
  cx?: number;
  cy?: number;
  payload?: ModelPoint;
};

type Props = {
  points: ModelPoint[];
  labs: string[];
  selectedId: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
};

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
  const on = Boolean(overlay);
  const open = payload.weights === "權重公開";
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
      <circle
        cx={cx}
        cy={cy}
        r={on ? 7 : 5}
        fill={open ? "var(--color-sage)" : "var(--color-amber)"}
        stroke={on ? "var(--color-fg)" : "var(--color-bg)"}
        strokeWidth={2}
        pointerEvents="none"
      />
      {on ? (
        <text
          x={payload.year > 2025.7 ? cx - 12 : cx + 12}
          y={cy + 4}
          textAnchor={payload.year > 2025.7 ? "end" : "start"}
          fill="var(--color-fg)"
          fontSize={12}
        >
          {payload.name}
        </text>
      ) : null}
    </g>
  );
}

export function ModelChart({ points, labs, selectedId, onSelect, onHover }: Props) {
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

  const ordered = [...points].sort((a, b) => a.year - b.year || a.id.localeCompare(b.id));
  const ticks = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

  return (
    <div ref={frame} className="model-chart relative">
      {width > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 16, bottom: 8, left: 4 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis
              type="number"
              dataKey="year"
              domain={[2020, 2027]}
              ticks={ticks}
              tickFormatter={(value: number) => String(value)}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-line)" }}
              tickLine={false}
              height={28}
            />
            <YAxis
              type="number"
              dataKey="lane"
              domain={[-0.5, Math.max(labs.length - 0.5, 0.5)]}
              ticks={labs.map((_, index) => index)}
              tickFormatter={(value: number) => labs[value] ?? ""}
              reversed
              width={width < 640 ? 72 : 88}
              tick={{ fill: "var(--color-fg)", fontSize: width < 640 ? 11 : 13 }}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine
              x={TODAY_YEAR}
              stroke="var(--color-faint)"
              strokeDasharray="3 4"
              label={{ value: "今天", fill: "var(--color-faint)", fontSize: 11, position: "insideTopRight" }}
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
              data={ordered.filter((point) => point.id === selectedId)}
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
