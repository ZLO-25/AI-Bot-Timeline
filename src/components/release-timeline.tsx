import { useMemo, useState } from "react";
import { releases, type Release } from "@/data/releases";
import type { Weights } from "@/data/models";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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
  const [selectedId, setSelectedId] = useState(visible[0]?.id ?? "");
  const shown = visible.find((item) => item.id === selectedId) ?? visible[0];
  const years = [...new Set(visible.map((item) => item.y))];

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-serif text-2xl text-fg">歷代發布</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          前沿實驗室有名字的一代，從 GPT-2 收到現在。不是每一個參數尺寸。上面的圖只畫有 AAII 和每題成本的型號，沒有這兩項的不進那張圖。
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
                .map((item) => {
                  const on = item.id === shown?.id;
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
                        <span className={item.weights === "權重公開" ? "shrink-0 text-xs text-sage" : "shrink-0 text-xs text-amber"}>
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
      <p className="mt-3 text-base leading-relaxed text-fg">{item.trait}</p>
    </article>
  );
}
