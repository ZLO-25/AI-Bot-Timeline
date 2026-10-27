import { useMemo, useState } from "react";
import { LAB_ORDER, labModels, type LabModel, type Weights } from "@/data/models";
import { ModelChart, type ModelPoint } from "@/components/model-chart";

type WeightFilter = "all" | Weights;
type RegionFilter = "all" | "中國";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function yearOf(m: LabModel) {
  return m.y + (m.m - 1) / 12 + (m.d - 1) / 365;
}

export function ModelBoard() {
  const [weights, setWeights] = useState<WeightFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [selectedId, setSelectedId] = useState("claude1");
  const [hoverId, setHoverId] = useState<string | null>(null);

  const visible = useMemo(() => {
    return labModels.filter((m) => {
      if (weights !== "all" && m.weights !== weights) return false;
      if (region === "中國" && m.region !== "中國") return false;
      return true;
    });
  }, [weights, region]);

  const labs = useMemo(
    () => LAB_ORDER.filter((lab) => visible.some((m) => m.lab === lab)),
    [visible],
  );

  const plotted = useMemo<ModelPoint[]>(() => {
    return visible.map((m) => ({ ...m, year: yearOf(m), lane: labs.indexOf(m.lab as (typeof LAB_ORDER)[number]) }));
  }, [visible, labs]);

  const shown = plotted.find((m) => m.id === (hoverId ?? selectedId)) ?? plotted[0];

  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-2xl text-base leading-relaxed text-muted">
        橫軸是時間，縱軸是實驗室。一點是一次旗艦發布，不是文明分數。琥珀是閉源，灰綠是權重公開。Google 的 Gemini、Anthropic 的 Claude，以及開源與中國實驗室，都在這張圖上。
      </p>
      <div className="flex gap-2 overflow-x-auto" role="group" aria-label="權重">
        <Filter pressed={weights === "all" && region === "all"} onClick={() => { setWeights("all"); setRegion("all"); }}>
          全部
        </Filter>
        <Filter pressed={weights === "權重公開"} onClick={() => setWeights(weights === "權重公開" ? "all" : "權重公開")}>
          權重公開
        </Filter>
        <Filter pressed={weights === "閉源"} onClick={() => setWeights(weights === "閉源" ? "all" : "閉源")}>
          閉源
        </Filter>
        <Filter pressed={region === "中國"} onClick={() => setRegion(region === "中國" ? "all" : "中國")}>
          中國公司
        </Filter>
      </div>

      <ModelChart
        points={plotted}
        labs={[...labs]}
        selectedId={shown?.id ?? ""}
        onSelect={(id) => {
          setHoverId(null);
          setSelectedId(id);
        }}
        onHover={setHoverId}
      />
      <p className="text-sm text-faint">點圓點看特色。同一列是同一家的換代，由左到右變新。</p>

      {shown ? (
        <article className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm text-amber">
            {shown.lab}
            <span className="mx-2 text-faint">·</span>
            {shown.region}
            <span className="mx-2 text-faint">·</span>
            <span className={shown.weights === "權重公開" ? "text-sage" : "text-amber"}>{shown.weights}</span>
          </p>
          <h2 className="mt-1 font-serif text-3xl leading-tight text-fg">{shown.name}</h2>
          <p className="mt-1 text-sm text-muted">{shown.dateLabel}</p>
          <p className="mt-4 text-base leading-relaxed text-fg">{shown.note}</p>
        </article>
      ) : null}

      <div className="rail-scroll flex gap-2 overflow-x-auto pb-2">
        {[...plotted]
          .sort((a, b) => a.year - b.year)
          .map((m) => {
            const on = m.id === shown?.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedId(m.id)}
                className={cx(
                  "flex h-16 w-36 shrink-0 flex-col items-start justify-center rounded-xl border px-3 text-left transition-transform duration-150 ease-out active:scale-[0.96]",
                  on ? "border-amber bg-surface-2" : "border-line bg-surface",
                )}
              >
                <span className="text-xs tabular-nums text-faint">{m.y}</span>
                <span className="w-full truncate text-sm font-semibold text-fg">{m.name}</span>
                <span className={m.weights === "權重公開" ? "text-xs text-sage" : "text-xs text-amber"}>
                  {m.lab}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

function Filter({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cx(
        "h-11 shrink-0 rounded-full px-3 text-sm font-semibold transition-transform duration-150 ease-out active:scale-[0.96]",
        pressed ? "bg-amber text-ink" : "border border-line bg-surface text-muted",
      )}
    >
      {children}
    </button>
  );
}
