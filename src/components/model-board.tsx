import { useMemo, useState } from "react";
import { labModels, type LabModel, type Weights } from "@/data/models";

type WeightFilter = "all" | Weights;
type RegionFilter = "all" | "中國";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function ModelBoard() {
  const [weights, setWeights] = useState<WeightFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [selectedId, setSelectedId] = useState("dsr1");

  const visible = useMemo(() => {
    return labModels.filter((m) => {
      if (weights !== "all" && m.weights !== weights) return false;
      if (region === "中國" && m.region !== "中國") return false;
      return true;
    });
  }, [weights, region]);

  const selected = visible.find((m) => m.id === selectedId) ?? visible[0];

  const years = useMemo(() => {
    const map = new Map<number, LabModel[]>();
    for (const m of visible) {
      const list = map.get(m.y) ?? [];
      list.push(m);
      map.set(m.y, list);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [visible]);

  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-2xl text-base leading-relaxed text-muted">
        這裡不打分數。座標圖問的是對文明的影響；這一頁只回答誰、在什麼時候、把哪一種用法做出來。收的是各家旗艦和開源權重，不是每週的小改版。
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 overflow-x-auto" role="group" aria-label="權重">
          <Filter pressed={weights === "all"} onClick={() => setWeights("all")}>
            全部
          </Filter>
          <Filter pressed={weights === "權重公開"} onClick={() => setWeights("權重公開")}>
            權重公開
          </Filter>
          <Filter pressed={weights === "閉源"} onClick={() => setWeights("閉源")}>
            閉源
          </Filter>
          <Filter pressed={region === "中國"} onClick={() => setRegion(region === "中國" ? "all" : "中國")}>
            中國公司
          </Filter>
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">
          {years.map(([year, items]) => (
            <section key={year} className="border-t border-line">
              <h2 className="py-3 font-serif text-2xl text-amber">{year}</h2>
              <ul className="flex flex-col">
                {items.map((m) => {
                  const on = m.id === selected?.id;
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(m.id)}
                        className={cx(
                          "flex w-full flex-col gap-1 border-t border-line px-1 py-3 text-left transition-transform duration-150 ease-out active:scale-[0.99] sm:flex-row sm:items-baseline sm:gap-4",
                          on && "bg-surface-2",
                        )}
                      >
                        <span className="w-16 shrink-0 text-sm tabular-nums text-faint">
                          {m.m}月
                        </span>
                        <span className="min-w-0 sm:flex-1">
                          <span className="block text-base font-semibold text-fg">{m.name}</span>
                          <span className="mt-0.5 block text-sm text-muted">{m.trait}</span>
                        </span>
                        <span className="flex shrink-0 gap-2 text-xs font-semibold">
                          <span className="text-muted">{m.lab}</span>
                          <span className={m.weights === "權重公開" ? "text-sage" : "text-amber"}>
                            {m.weights}
                          </span>
                          {m.region === "中國" ? <span className="text-sage">中國</span> : null}
                        </span>
                      </button>
                      {on ? (
                        <p className="px-1 pb-3 text-sm leading-relaxed text-fg lg:hidden">{m.note}</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          {visible.length === 0 ? (
            <p className="border-t border-line py-8 text-sm text-muted">這個篩選下面沒有模型。</p>
          ) : null}
        </div>

        {selected ? (
          <article className="sticky top-4 hidden rounded-2xl border border-line bg-surface p-5 lg:block">
            <p className="text-sm text-amber">
              {selected.lab}
              <span className="mx-2 text-faint">·</span>
              {selected.region}
            </p>
            <h2 className="mt-1 font-serif text-3xl leading-tight text-fg">{selected.name}</h2>
            <p className="mt-1 text-sm text-muted">{selected.dateLabel}</p>
            <p
              className={cx(
                "mt-4 text-sm font-semibold",
                selected.weights === "權重公開" ? "text-sage" : "text-amber",
              )}
            >
              {selected.weights}
            </p>
            <p className="mt-4 text-base leading-relaxed text-fg">{selected.note}</p>
            <p className="mt-4 text-sm leading-relaxed text-faint">
              權重公開，指的是別人下載得到、可以自己部署或微調。訓練它的算力和資料通常仍然很貴。閉源則是能力留在廠商的服務裡。
            </p>
          </article>
        ) : null}
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
