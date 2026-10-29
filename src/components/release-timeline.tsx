import { useMemo, useState } from "react";
import { aaiiModels, type Weights } from "@/data/models";
import { releases, type Release } from "@/data/releases";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const V5_ID: Record<string, string> = {
  carbon: "carbon",
  opus55: "opus55",
  astra: "astra",
  sol: "sol",
  sonnet55: "sonnet55",
  terra: "terra",
  argon: "argon",
  fable: "fable",
  kimi31: "kimi31",
  muse: "muse",
  haiku55: "haiku",
  spark13r: "spark13",
  grok47: "grok47",
  qwen38r: "qwen38",
  dsv41: "dsv41",
  glm53r: "glm53",
  gem38r: "gem38",
  mimo: "mimo",
  minimax: "minimax",
  step5: "step5",
  ling: "ling",
  luna: "luna",
  "spark-open": "spark-open",
  mistral4: "mistral4",
};

/** 舊指數上的最高力度分數。不能和 v5 直接比。 */
const OLD_INDEX: Record<string, { score: number; index: string }> = {
  opus48: { score: 56, index: "v4.1" },
  gpt55: { score: 55, index: "v4.1" },
  sonnet5: { score: 53, index: "v4.1" },
  gem31: { score: 46, index: "v4.1" },
  dsv4: { score: 44, index: "v4.1" },
};

function scoreOf(id: string) {
  const current = V5_ID[id];
  if (current) {
    const model = aaiiModels.find((item) => item.id === current);
    if (model) return { score: model.aaii, index: "v5" };
  }
  return OLD_INDEX[id] ?? null;
}

export function ReleaseTimeline({
  lab,
  weights,
  region,
}: {
  lab: string;
  weights: "all" | Weights;
  region: "all" | "中國";
}) {
  const visible = useMemo(
    () =>
      releases.filter((item) => {
        if (lab !== "all" && item.lab !== lab) return false;
        if (weights !== "all" && item.weights !== weights) return false;
        if (region === "中國" && item.region !== "中國") return false;
        return true;
      }),
    [lab, weights, region],
  );
  const [selectedId, setSelectedId] = useState("");
  const shown = visible.find((item) => item.id === selectedId) ?? visible[visible.length - 1];
  const years = [...new Set(visible.map((item) => item.y))].sort((a, b) => b - a);

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-serif text-2xl text-fg">歷代發布</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          每一列右側是 AAII。標 v5 的和上面那張圖相同。標 v4.1 的是舊考卷，數字不能和 v5 直接比。沒有數字的，是這兩份指數都沒有公開分數。
        </p>
      </div>
      {shown ? <ReleaseDetail item={shown} /> : <p className="text-sm text-muted">這個篩選下面沒有發布。</p>}
      <div className="flex flex-col gap-4">
        {years.map((year) => (
          <div key={year}>
            <p className="mb-2 text-sm font-semibold tabular-nums text-faint">{year}</p>
            <ul className="flex flex-col gap-1">
              {visible
                .filter((item) => item.y === year)
                .slice()
                .reverse()
                .map((item) => {
                  const on = item.id === shown?.id;
                  const score = scoreOf(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className={cx(
                          "flex w-full items-baseline gap-3 rounded-xl border px-3 py-2 text-left",
                          on ? "border-amber bg-surface-2" : "border-line bg-surface",
                        )}
                      >
                        <span className="w-28 shrink-0 text-xs tabular-nums text-faint">{item.dateLabel}</span>
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-fg">{item.name}</span>
                        <span className="w-16 shrink-0 text-right text-sm tabular-nums text-amber">
                          {score ? (
                            <>
                              {score.score}
                              <span className="ml-1 text-xs text-faint">{score.index}</span>
                            </>
                          ) : (
                            <span className="text-xs text-faint">—</span>
                          )}
                        </span>
                        <span className={item.weights === "權重公開" ? "w-16 shrink-0 text-right text-xs text-sage" : "w-16 shrink-0 text-right text-xs text-amber"}>
                          {item.lab}
                        </span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReleaseDetail({ item }: { item: Release }) {
  const score = scoreOf(item.id);
  return (
    <article className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-sm text-amber">
        {item.lab}
        <span className="mx-2 text-faint">·</span>
        {item.region}
        <span className="mx-2 text-faint">·</span>
        <span className={item.weights === "權重公開" ? "text-sage" : "text-amber"}>{item.weights}</span>
      </p>
      <h3 className="mt-1 font-serif text-3xl leading-tight text-fg">{item.name}</h3>
      <p className="mt-1 text-sm text-muted">發布：{item.dateLabel}</p>
      {score ? (
        <p className="mt-4">
          <span className="block text-sm text-faint">AAII · 智力指數 {score.index}</span>
          <span className="font-serif text-5xl leading-none tabular-nums text-amber">{score.score}</span>
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">沒有公開的 AAII。</p>
      )}
      {score && score.index !== "v5" ? (
        <p className="mt-2 text-sm leading-relaxed text-faint">這是舊指數上的最高力度分數，考卷和現在的 v5 不同，不能和上面那張圖的數字直接比。</p>
      ) : null}
      <p className="mt-3 text-base leading-relaxed text-fg">{item.trait}</p>
    </article>
  );
}
