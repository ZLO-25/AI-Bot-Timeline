import { useEffect, useMemo, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Pause, Play } from "lucide-react";
import {
  DOMAIN_LABEL,
  SCORE_META,
  YEAR_MAX,
  YEAR_MIN,
  impactOf,
  milestones,
  yearOf,
  type DomainId,
  type Milestone,
} from "@/data/milestones";
import { ImpactChart, type PlotPoint } from "@/components/impact-chart";
import { Lesson } from "@/components/lesson";
import { ModelBoard } from "@/components/model-board";

type DomainFilter = DomainId | "all";
type RailSort = "time" | "impact";
type ViewId = "map" | "models" | "read";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "map", label: "文明座標" },
  { id: "models", label: "模型時間" },
  { id: "read", label: "怎麼讀" },
];

const LENSES: { id: string; label: string; from: number; to: number }[] = [
  { id: "all", label: "全史", from: YEAR_MIN, to: YEAR_MAX },
  { id: "deep", label: "2012 起", from: 2012, to: YEAR_MAX },
  { id: "now", label: "2022 起", from: 2022, to: YEAR_MAX },
  { id: "next", label: "未來", from: 2026, to: YEAR_MAX },
];

const DOMAINS: { id: DomainFilter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "foundation", label: "奠基" },
  { id: "perception", label: "感知" },
  { id: "language", label: "語言" },
  { id: "generative", label: "生成" },
  { id: "science", label: "科學" },
  { id: "agents", label: "代理人" },
];

function withPlot(m: Milestone): PlotPoint {
  return { ...m, year: yearOf(m), impact: impactOf(m) };
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Atlas() {
  const [domain, setDomain] = useState<DomainFilter>("all");
  const [range, setRange] = useState<[number, number]>([2022, YEAR_MAX]);
  const [selectedId, setSelectedId] = useState("agents-daily");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [railSort, setRailSort] = useState<RailSort>("time");
  const [view, setView] = useState<ViewId>("map");

  const plotted = useMemo(() => milestones.map(withPlot), []);

  const visible = useMemo(() => {
    return plotted.filter((m) => {
      if (domain !== "all" && m.domain !== domain) return false;
      return m.y >= range[0] && m.y <= range[1];
    });
  }, [plotted, domain, range]);

  const orderedIds = useMemo(() => {
    return [...visible].sort((a, b) => a.year - b.year).map((m) => m.id);
  }, [visible]);

  useEffect(() => {
    setRange((current) => (current[1] === 2026 ? [Math.min(current[0], 2022), YEAR_MAX] : current));
  }, []);

  useEffect(() => {
    if (visible.some((m) => m.id === selectedId)) return;
    const top = [...visible].sort((a, b) => b.impact - a.impact)[0];
    if (top) setSelectedId(top.id);
  }, [visible, selectedId]);

  useEffect(() => {
    if (!playing) return;
    if (orderedIds.length === 0) return;
    const timer = window.setInterval(() => {
      setSelectedId((cur) => {
        const i = orderedIds.indexOf(cur);
        return orderedIds[(i + 1) % orderedIds.length];
      });
    }, 1600);
    return () => window.clearInterval(timer);
  }, [playing, orderedIds]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(`rail-${selectedId}`)?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [selectedId]);

  const shown =
    plotted.find((m) => m.id === (hoverId && visible.some((v) => v.id === hoverId) ? hoverId : selectedId)) ??
    plotted.find((m) => m.id === "chatgpt") ??
    plotted[0];

  const pool = plotted.filter((m) => Boolean(m.forecast) === Boolean(shown.forecast));
  const higher = pool.filter((m) => m.impact > shown.impact).length;
  const tied = pool.filter((m) => m.impact === shown.impact).length;
  const rank = higher + 1;

  const rail = [...visible].sort((a, b) =>
    railSort === "impact" ? b.impact - a.impact || a.year - b.year : a.year - b.year,
  );

  function select(id: string) {
    setPlaying(false);
    setHoverId(null);
    setSelectedId(id);
  }

  function applyLens(from: number, to: number) {
    setPlaying(false);
    setRange([from, to]);
  }

  const activeLens = LENSES.find((l) => l.from === range[0] && l.to === range[1])?.id;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-amber">時間 × 文明影響</p>
          <h1 className="mt-1 font-serif text-4xl leading-none text-fg sm:text-5xl">AI 文明座標</h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            {view === "models"
              ? "這張圖只排模型換代。橫軸是時間，縱軸是實驗室，不打文明分數。GPT、Claude、Gemini 各自一列。"
              : view === "read"
                ? "分數不是智商，也不是跑分。下面說明四項怎麼加，以及思考和投入各算在哪。"
                : "橫軸是時間，縱軸是對人類文明的影響，0 到 100。這張圖不收每一次模型換代。實心是已發生的事。空心是預測：分數表示若發生，不是發生機率。"}
          </p>
        </div>
        {view === "map" ? (
          <button
            type="button"
            aria-pressed={playing}
            onClick={() => setPlaying((v) => !v)}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-amber px-4 text-sm font-semibold text-ink transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            {playing ? "暫停" : "沿時間播放"}
          </button>
        ) : null}
      </header>

      <div className="flex gap-2 overflow-x-auto" role="group" aria-label="畫面">
        {VIEWS.map((item) => (
          <Chip
            key={item.id}
            pressed={view === item.id}
            onClick={() => {
              setPlaying(false);
              setView(item.id);
            }}
          >
            {item.label}
          </Chip>
        ))}
      </div>

      {view === "models" ? <ModelBoard /> : null}
      {view === "read" ? <Lesson /> : null}
      {view === "map" ? (
      <>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2 overflow-x-auto" role="group" aria-label="時間範圍">
          {LENSES.map((lens) => (
            <Chip
              key={lens.id}
              pressed={activeLens === lens.id}
              onClick={() => applyLens(lens.from, lens.to)}
            >
              {lens.label}
            </Chip>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto" role="group" aria-label="類型">
          {DOMAINS.map((item) => (
            <Chip
              key={item.id}
              pressed={domain === item.id}
              onClick={() => {
                setPlaying(false);
                setDomain(item.id);
              }}
            >
              {item.label}
            </Chip>
          ))}
        </div>
      </div>

      <section className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3 px-1">
            <p className="text-sm text-muted">縱軸 · 文明影響</p>
            <p className="text-sm text-faint">70 以上：改寫知識、科學或日常工作</p>
          </div>
          <ImpactChart
            points={visible}
            from={range[0]}
            to={range[1]}
            selectedId={shown.id}
            onSelect={select}
            onHover={setHoverId}
          />
          <div className="flex items-center gap-3 px-1">
            <p className="shrink-0 text-sm text-muted">橫軸 · 時間</p>
            <Slider.Root
              className="relative flex h-11 w-full touch-none items-center"
              min={YEAR_MIN}
              max={YEAR_MAX}
              step={1}
              minStepsBetweenThumbs={1}
              value={range}
              onValueChange={(next) => {
                const [a, b] = next;
                if (a == null || b == null) return;
                setPlaying(false);
                setRange([a, b]);
              }}
              aria-label="時間視窗"
            >
              <Slider.Track className="relative h-1 grow rounded-full bg-line">
                <Slider.Range className="absolute h-full rounded-full bg-amber" />
              </Slider.Track>
              <Slider.Thumb
                aria-label="起始年"
                className="relative block size-11 rounded-full bg-transparent after:absolute after:top-1/2 after:left-1/2 after:size-4 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border-2 after:border-bg after:bg-amber"
              />
              <Slider.Thumb
                aria-label="結束年"
                className="relative block size-11 rounded-full bg-transparent after:absolute after:top-1/2 after:left-1/2 after:size-4 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border-2 after:border-bg after:bg-amber"
              />
            </Slider.Root>
            <p className="shrink-0 text-sm tabular-nums text-fg">
              {range[0]}–{range[1]}
            </p>
          </div>
          <p className="px-1 text-sm leading-relaxed text-faint">
            實心是已發生，空心是預測。右側淡色區在今天之後。點圓點，或用下方列表。
          </p>
        </div>

        <article className="rounded-2xl border border-line bg-surface p-5">
          <p className={shown.forecast ? "text-sm text-sage" : "text-sm text-amber"}>
            {shown.forecast ? `預測 · 信心${shown.confidence} · 還沒發生` : DOMAIN_LABEL[shown.domain]}
          </p>
          <h2 className="mt-1 font-serif text-3xl leading-tight text-fg">{shown.name}</h2>
          <p className="mt-1 text-sm text-muted">{shown.dateLabel}</p>
          <p className="mt-4 flex items-end gap-3">
            <span
              className={cx(
                "font-serif text-6xl leading-none tabular-nums",
                shown.forecast ? "text-sage" : "text-amber",
              )}
            >
              {shown.impact}
            </span>
            <span className="mb-1 text-sm leading-snug text-muted">
              {shown.forecast ? "若發生 " : ""}
              {tied > 1 ? `並列第 ${rank}` : `第 ${rank}`} / {pool.length}
              <br />
              {shown.forecast ? "只在預測之間排" : "已發生的事"}
            </span>
          </p>
          <dl className="mt-5 flex flex-col gap-3">
            {SCORE_META.map((axis) => {
              const value = shown[axis.key];
              return (
                <div key={axis.key}>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-sm text-fg">
                      {axis.label}
                      <span className="ml-2 text-faint">{axis.hint}</span>
                    </dt>
                    <dd className="text-sm tabular-nums text-amber">
                      {value}
                      <span className="text-faint">/25</span>
                    </dd>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-amber"
                      style={{ width: `${(value / 25) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </dl>
          <p className="mt-5 text-base leading-relaxed text-fg">{shown.summary}</p>
          <p className="mt-3 text-sm leading-relaxed text-faint">{shown.source}</p>
        </article>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-muted">
            這個視窗裡的 {visible.length} 個節點
          </h2>
          <div className="flex gap-2" role="group" aria-label="列表排序">
            <Chip pressed={railSort === "time"} onClick={() => setRailSort("time")}>
              依時間
            </Chip>
            <Chip pressed={railSort === "impact"} onClick={() => setRailSort("impact")}>
              依影響
            </Chip>
          </div>
        </div>
        <div className="rail-scroll flex gap-2 overflow-x-auto pb-2">
          {rail.map((m) => {
            const on = m.id === shown.id;
            return (
              <button
                key={m.id}
                id={`rail-${m.id}`}
                type="button"
                onClick={() => select(m.id)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "touch") return;
                  setHoverId(m.id);
                }}
                onPointerLeave={() => setHoverId(null)}
                className={cx(
                  "flex h-16 w-36 shrink-0 flex-col items-start justify-center rounded-xl border px-3 text-left transition-transform duration-150 ease-out active:scale-[0.96]",
                  on
                    ? m.forecast
                      ? "border-sage bg-surface-2"
                      : "border-amber bg-surface-2"
                    : "border-line bg-surface",
                )}
              >
                <span className="text-xs tabular-nums text-faint">
                  {m.forecast ? `${m.y} 預測` : m.y}
                </span>
                <span className="w-full truncate text-sm font-semibold text-fg">{m.chartLabel}</span>
                <span className={cx("text-xs tabular-nums", m.forecast ? "text-sage" : "text-amber")}>
                  {m.impact}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-line pt-4 text-sm leading-relaxed text-faint">
        收的是範式轉移，不是每一次模型改版。ChatGPT 很高，因為使用方式被改寫；AlphaFold
        很高，因為生物學的基礎設施被改寫；Transformer 很高，因為後來的系統站在它上面。今天之後的空心點是情節：代理人若成為工作起點、科學發現若變成合作、以及一個還未被做出來的通用學習系統。信心低的是年份，不是把影響說小。各家旗艦和開源權重的發布時間在「模型時間」，分數怎麼讀在「怎麼讀」。
      </footer>
      </>
      ) : null}
    </main>
  );
}

function Chip({
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
