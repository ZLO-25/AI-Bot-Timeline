import { useMemo, useState } from "react";
import { AAII_SOURCE, aaiiModels, paretoOf, type AaiiPoint, type Weights } from "@/data/models";
import { ModelChart, type CostPoint } from "@/components/model-chart";
import { ReleaseTimeline } from "@/components/release-timeline";

type WeightFilter = "all" | Weights;
type RegionFilter = "all" | "中國";

const LAB_ORDER = [
  "OpenAI",
  "Anthropic",
  "Google",
  "xAI",
  "Meta",
  "深度求索",
  "阿里",
  "月之暗面",
  "智譜",
  "小米",
  "MiniMax",
  "階躍星辰",
  "螞蟻",
  "百度",
  "Mistral",
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

export function ModelBoard() {
  const [weights, setWeights] = useState<WeightFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [lab, setLab] = useState<string>("all");
  const [selectedId, setSelectedId] = useState("sol");
  const [hoverId, setHoverId] = useState<string | null>(null);

  const visible = useMemo(() => {
    return aaiiModels.filter((model) => {
      if (weights !== "all" && model.weights !== weights) return false;
      if (region === "中國" && model.region !== "中國") return false;
      if (lab !== "all" && model.lab !== lab) return false;
      return true;
    });
  }, [weights, region, lab]);

  const frontier = useMemo(() => new Set(paretoOf(visible).map((model) => model.id)), [visible]);

  const plotted = useMemo<CostPoint[]>(() => {
    const ranked = [...visible].sort((a, b) => b.aaii - a.aaii || a.cost - b.cost);
    const placed: { x: number; y: number }[] = [];
    const shift = new Map<string, number>();
    for (const model of ranked) {
      const x = Math.log10(model.cost);
      const options = [-14, 14, -28, 28, -42];
      let dy = -14;
      for (const option of options) {
        const y = model.aaii + option / 7;
        const clash = placed.some((spot) => Math.abs(spot.x - x) < 0.22 && Math.abs(spot.y - y) < 3);
        dy = option;
        if (!clash) break;
      }
      placed.push({ x, y: model.aaii + dy / 7 });
      shift.set(model.id, dy);
    }
    return visible.map((model) => ({
      ...model,
      frontier: frontier.has(model.id),
      labelDy: shift.get(model.id) ?? -14,
    }));
  }, [visible, frontier]);

  const shown =
    plotted.find((model) => model.id === (hoverId ?? selectedId)) ??
    [...plotted].sort((a, b) => b.aaii - a.aaii)[0];

  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-2xl text-base leading-relaxed text-muted">
        縱軸是 AAII，Artificial Analysis 的智力指數 v5，滿分 100，目前最高 59。橫軸是 cost per task：跑完指數裡一題的平均美元，對數刻度。左上更好。
      </p>
      <div className="flex gap-2 overflow-x-auto" role="group" aria-label="篩選">
        <Filter
          pressed={weights === "all" && region === "all" && lab === "all"}
          onClick={() => {
            setWeights("all");
            setRegion("all");
            setLab("all");
          }}
        >
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
      <div className="flex gap-2 overflow-x-auto" role="group" aria-label="公司">
        <Filter pressed={lab === "all"} onClick={() => setLab("all")}>
          全部公司
        </Filter>
        {LAB_ORDER.map((name) => (
          <Filter key={name} pressed={lab === name} onClick={() => setLab(lab === name ? "all" : name)}>
            {name}
          </Filter>
        ))}
      </div>

      <ModelChart
        points={plotted}
        selectedId={shown?.id ?? ""}
        onSelect={(id) => {
          setHoverId(null);
          setSelectedId(id);
        }}
        onHover={setHoverId}
      />
      <p className="text-sm leading-relaxed text-faint">
        琥珀是閉源，灰綠是權重公開。這張圖是智力指數 v5。Opus 4.8、Sonnet 5 的分數是舊指數，不畫在這裡，在下面的歷代發布。
      </p>

      {shown ? <Detail model={shown} /> : null}

      <div className="rail-scroll flex gap-2 overflow-x-auto pb-2">
        {[...plotted]
          .sort((a, b) => b.aaii - a.aaii || a.cost - b.cost)
          .map((model) => {
            const on = model.id === shown?.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setSelectedId(model.id)}
                className={cx(
                  "flex h-16 w-40 shrink-0 flex-col items-start justify-center rounded-xl border px-3 text-left transition-transform duration-150 ease-out active:scale-[0.96]",
                  on ? "border-amber bg-surface-2" : "border-line bg-surface",
                )}
              >
                <span className="w-full truncate text-sm font-semibold text-fg">{model.chartLabel ?? model.name}</span>
                <span className={model.weights === "權重公開" ? "text-xs text-sage" : "text-xs text-amber"}>
                  {model.aaii} · {money(model.cost)}
                </span>
              </button>
            );
          })}
      </div>
      <ReleaseTimeline lab={lab} weights={weights} region={region} />
    </div>
  );
}

function Detail({ model }: { model: AaiiPoint }) {
  return (
    <article className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-sm text-amber">
        {model.lab}
        <span className="mx-2 text-faint">·</span>
        {model.region}
        <span className="mx-2 text-faint">·</span>
        <span className={model.weights === "權重公開" ? "text-sage" : "text-amber"}>{model.weights}</span>
      </p>
      <h2 className="mt-1 font-serif text-3xl leading-tight text-fg">{model.name}</h2>
      <p className="mt-1 text-sm text-muted">
        發布：{model.released}
        <span className="mx-2 text-faint">·</span>
        思考力度：{model.effort}
      </p>
      <p className="mt-4 flex items-end gap-6">
        <span>
          <span className="block text-sm text-faint">AAII</span>
          <span className="font-serif text-5xl leading-none tabular-nums text-amber">{model.aaii}</span>
        </span>
        <span>
          <span className="block text-sm text-faint">每題成本</span>
          <span className="font-serif text-5xl leading-none tabular-nums text-fg">{money(model.cost)}</span>
        </span>
      </p>
      <p className="mt-4 text-base leading-relaxed text-fg">{model.note}</p>
      <p className="mt-3 text-sm leading-relaxed text-faint">{AAII_SOURCE}</p>
    </article>
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
