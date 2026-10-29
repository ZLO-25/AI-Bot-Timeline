import { SCORE_META } from "@/data/milestones";

const EXAMPLES: Record<string, string> = {
  reach: "Transformer 發表時幾乎沒有大眾使用者，觸及很低。ChatGPT 五天破百萬人，觸及才滿。熱門不等於觸及，要有人真的用到。",
  capability: "新學會的是一種事，不是榜單多幾分。o1 和 DeepSeek-R1 新學會的是「回答前先花計算去想」。下一個只是更準的聊天，能力項就不會再跳。",
  infrastructure: "後來的系統離不開它，這項才高。Transformer 的能力不是這張圖上最高的，鎖定很高，因為後面的語言模型幾乎都站在上面。",
  civilization: "改寫的是知識、科學、勞動或制度。AlphaFold 讓蛋白質結構從實驗瓶頸變成可查詢。一個更好的聊天模型，不一定改寫制度。",
};

export function Lesson() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <section>
        <h2 className="font-serif text-3xl text-fg">縱軸不是智商</h2>
        <p className="mt-3 text-base leading-relaxed text-fg">
          0 到 100 量的是這件事對人類文明的影響，不是模型多會考試。所以更強的後繼模型可以分數更低。GPT-5 是同一群人用到的模型變強；ChatGPT 是使用方式斷掉、重來一次。前者是升級，後者是斷裂。
        </p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          分數是編輯評估，用同一把尺，方便比較，也方便反對。它不是測量值，沒有儀器。不同意總分時，看是哪一項讓你不同意。
        </p>
      </section>

      <section>
        <h2 className="font-serif text-3xl text-fg">四項各自在問什麼</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">每一項 0 到 25，加總就是縱軸。拆開是為了讓評估可以被反駁。</p>
        <dl className="mt-5 flex flex-col gap-5">
          {SCORE_META.map((axis) => (
            <div key={axis.key} className="border-t border-line pt-4">
              <dt className="text-base font-semibold text-amber">
                {axis.label}
                <span className="ml-2 font-normal text-faint">{axis.hint}</span>
              </dt>
              <dd className="mt-2 text-base leading-relaxed text-fg">{EXAMPLES[axis.key]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="font-serif text-3xl text-fg">思考，和投入，算在哪</h2>
        <p className="mt-3 text-base leading-relaxed text-fg">
          思考指的是模型在回答之前多花的計算。o1、Claude 的混合推理、DeepSeek-R1 都是這種。它主要進「能力」：機器新學會先想再答。它不會自動變成「後果」。想得更久，不代表學校、公司和實驗室已經改了做法。
        </p>
        <p className="mt-3 text-base leading-relaxed text-fg">
          投入指的是人這一方要投多少注意力、錢和制度。觸及看的是已經投進去的人有多少，不是論文有多熱。鎖定看的是以後想撤掉要付的代價：介面、資料、工作流都綁上了，才叫鎖定高。一個很強但沒人接入工作的模型，投入仍然低。
        </p>
      </section>

      <section>
        <h2 className="font-serif text-3xl text-fg">灰綠點是情節</h2>
        <p className="mt-3 text-base leading-relaxed text-fg">
          今天之後的點還沒發生。分數的意思是「若發生，影響有多大」，不是發生機率。信心寫的是年份穩不穩。通用學習排得最高，是因為那個定義本身就是文明級的斷裂；2030 只是常被提到的窗口，不是行程表。信心低，低在年份，不是把影響說小。
        </p>
      </section>

      <section>
        <h2 className="font-serif text-3xl text-fg">兩張圖為什麼分開</h2>
        <p className="mt-3 text-base leading-relaxed text-fg">
          座標只收範式轉移：使用方式、科學基礎設施、或後面所有系統都站上去的那一步。模型那一頁是另一把尺：縱軸 AAII，橫軸是完成指數裡一題要花的美元。GPT-6.1 Sol 可以離最強只差幾分、卻便宜很多；這不表示它改寫了文明。跑分和每題成本回答「現在用哪一個」，不回答「這件事有多大」。
        </p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          權重公開改變的是誰能部署，不一定是誰能從零訓練下一代。訓練的帳單通常仍在少數實驗室。閉源改變的是誰規定你怎麼用。兩件事都能影響文明，但進座標圖時，要看它有沒有改寫用法、科學或制度，而不只是換了一個模型名字。
        </p>
      </section>
    </div>
  );
}
