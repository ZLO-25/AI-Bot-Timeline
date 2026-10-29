export type DomainId =
  | "foundation"
  | "perception"
  | "language"
  | "generative"
  | "science"
  | "agents";

export type ScoreKey = "reach" | "capability" | "infrastructure" | "civilization";

export type Reading = {
  title: string;
  href: string;
  note: string;
};

export type Milestone = {
  id: string;
  y: number;
  m: number;
  d: number;
  dateLabel: string;
  name: string;
  chartLabel: string;
  domain: DomainId;
  /** 當時有多少人真正用到或看見。0–25 */
  reach: number;
  /** 機器新學會的那一類事。0–25 */
  capability: number;
  /** 後來的系統有多依賴它。0–25 */
  infrastructure: number;
  /** 知識、科學、勞動或制度被改寫的程度。0–25 */
  civilization: number;
  /** 全史視窗不標，短視窗才標，避免擠在一起 */
  anchor: boolean;
  /** 標籤相對圓點的位置。預設在上方。 */
  labelPlace?: "above" | "below" | "left";
  summary: string;
  source: string;
  /** 還沒發生。分數是「若發生」，不是機率。 */
  forecast?: boolean;
  /** 低是年份不確定，不是影響小。 */
  confidence?: "高" | "中" | "低";
  /** 預測才有：怎麼讀這一格，以及怎麼反駁。 */
  lesson?: string[];
  readings?: Reading[];
};

export const DOMAIN_LABEL: Record<DomainId, string> = {
  foundation: "奠基",
  perception: "感知",
  language: "語言",
  generative: "生成",
  science: "科學",
  agents: "代理人",
};

export const SCORE_META: { key: ScoreKey; label: string; hint: string }[] = [
  { key: "reach", label: "觸及", hint: "當時有多少人真正用到或看見" },
  { key: "capability", label: "能力", hint: "機器新學會的那一類事" },
  { key: "infrastructure", label: "鎖定", hint: "後來的系統有多依賴它" },
  { key: "civilization", label: "後果", hint: "知識、科學、勞動或制度被改寫的程度" },
];

export const milestones: Milestone[] = [
  {
    id: "mcculloch",
    y: 1943,
    m: 7,
    d: 1,
    dateLabel: "1943年",
    name: "麥卡洛克－皮茨神經元",
    chartLabel: "神經元模型",
    domain: "foundation",
    reach: 2,
    capability: 10,
    infrastructure: 8,
    civilization: 4,
    anchor: false,
    summary:
      "沃倫·麥卡洛克與沃爾特·皮茨把神經元寫成可以做邏輯的單位。沒有可訓練的權重，實驗室以外也幾乎沒人碰到它，但「用網路做計算」這條路從這裡分支出去。",
    source: "McCulloch & Pitts，《Bulletin of Mathematical Biophysics》，1943",
  },
  {
    id: "turing",
    y: 1950,
    m: 10,
    d: 1,
    dateLabel: "1950年10月",
    name: "圖靈的提問",
    chartLabel: "圖靈",
    domain: "foundation",
    reach: 8,
    capability: 6,
    infrastructure: 8,
    civilization: 18,
    anchor: true,
    summary:
      "《心智》刊出〈運算機器與智能〉。圖靈沒有交出會思考的機器，他把「機器能思考嗎」改成可以認真吵的模仿遊戲。這個問法本身進了之後一世紀的文明想像。",
    source: "A. M. Turing，《Mind》，1950年10月",
  },
  {
    id: "dartmouth",
    y: 1956,
    m: 7,
    d: 13,
    dateLabel: "1956年夏",
    name: "達特茅斯會議",
    chartLabel: "達特茅斯",
    domain: "foundation",
    reach: 6,
    capability: 4,
    infrastructure: 14,
    civilization: 16,
    anchor: false,
    summary:
      "麥卡錫、明斯基、羅徹斯特與香農把一個尚未存在的領域命名為人工智慧。會議沒有交出智慧，它交出研究計畫、經費語言，以及一個此後不再消失的名字。",
    source: "Dartmouth Summer Research Project，1956",
  },
  {
    id: "perceptron",
    y: 1958,
    m: 7,
    d: 7,
    dateLabel: "1958年7月7日",
    name: "感知機",
    chartLabel: "感知機",
    domain: "foundation",
    reach: 8,
    capability: 10,
    infrastructure: 6,
    civilization: 4,
    anchor: false,
    summary:
      "羅森布拉特向美國海軍展示感知機，報紙把它寫成即將走路、說話、有意識的機器。它是第一個被廣泛看見的可訓練神經模型；誇大的承諾也幫著鋪了後來的寒冬。",
    source: "Rosenblatt 公開展示，1958年7月7日",
  },
  {
    id: "eliza",
    y: 1966,
    m: 1,
    d: 1,
    dateLabel: "1966年1月",
    name: "ELIZA",
    chartLabel: "ELIZA",
    domain: "foundation",
    reach: 12,
    capability: 8,
    infrastructure: 2,
    civilization: 8,
    anchor: false,
    summary:
      "魏岑鮑姆用句子模板讓程式扮演心理治療師。人們對一段腳本產生情感，這比程式本身更要緊：對話的錯覺，很早就被證明足以改變人的行為。",
    source: "Weizenbaum，《Communications of the ACM》，1966年1月",
  },
  {
    id: "backprop",
    y: 1986,
    m: 10,
    d: 9,
    dateLabel: "1986年10月9日",
    name: "反向傳播",
    chartLabel: "反向傳播",
    domain: "foundation",
    reach: 4,
    capability: 14,
    infrastructure: 16,
    civilization: 4,
    anchor: false,
    summary:
      "魯梅爾哈特、辛頓與威廉斯在《自然》把反向傳播講成可以重複的方法。多層網路因此在原則上訓得動。公眾無感，之後的深度學習卻離不開這一步。",
    source: "Rumelhart, Hinton & Williams，《Nature》，1986年10月9日",
  },
  {
    id: "deepblue",
    y: 1997,
    m: 5,
    d: 11,
    dateLabel: "1997年5月11日",
    name: "深藍擊敗卡斯帕羅夫",
    chartLabel: "深藍",
    domain: "foundation",
    reach: 20,
    capability: 10,
    infrastructure: 4,
    civilization: 10,
    anchor: true,
    summary:
      "深藍在重賽第六局贏下卡斯帕羅夫。倒下的是西洋棋，方法是搜索與專用硬體，不是通用智慧。全球觀眾仍第一次同時看見：機器贏了我們認定的智力冠軍。",
    source: "IBM Deep Blue 對卡斯帕羅夫，第六局，1997年5月11日",
  },
  {
    id: "alexnet",
    y: 2012,
    m: 9,
    d: 30,
    dateLabel: "2012年9月30日",
    name: "AlexNet",
    chartLabel: "AlexNet",
    domain: "perception",
    reach: 10,
    capability: 20,
    infrastructure: 20,
    civilization: 16,
    anchor: true,
    summary:
      "AlexNet 在 ImageNet 把前五錯誤率從約 26% 拉到約 15%。差距大到不能再把深度網路當興趣。圖像、晶片與整個產業的路線在這一年改道，街上的人還要再等很久才感覺到。",
    source: "ImageNet 大規模視覺辨識挑戰，2012年9月30日",
  },
  {
    id: "gan",
    y: 2014,
    m: 6,
    d: 10,
    dateLabel: "2014年6月10日",
    name: "生成對抗網路",
    chartLabel: "GAN",
    domain: "generative",
    reach: 6,
    capability: 16,
    infrastructure: 12,
    civilization: 10,
    anchor: false,
    summary:
      "古德費洛提出生成對抗網路：一個網路造假，一個網路抓假。它還不是後來的圖像產品，但它讓「生成讓人相信的新樣本」變成可以訓練的遊戲。",
    source: "Goodfellow 等，arXiv:1406.2661，2014年6月10日",
  },
  {
    id: "alphago",
    y: 2016,
    m: 3,
    d: 15,
    dateLabel: "2016年3月15日",
    name: "AlphaGo 對李世乭",
    chartLabel: "AlphaGo",
    domain: "science",
    reach: 22,
    capability: 16,
    infrastructure: 8,
    civilization: 16,
    anchor: false,
    summary:
      "AlphaGo 在首爾以 4 比 1 擊敗李世乭。第二局第 37 手被職業棋士稱為不像人會下的一手。圍棋的盤面大到暴力搜索無效，這場比賽改的是「直覺是否為人類獨有」的公共信念。",
    source: "AlphaGo 對李世乭，首爾，2016年3月9–15日",
  },
  {
    id: "transformer",
    y: 2017,
    m: 6,
    d: 12,
    dateLabel: "2017年6月12日",
    name: "Transformer",
    chartLabel: "Transformer",
    domain: "language",
    reach: 10,
    capability: 22,
    infrastructure: 24,
    civilization: 20,
    anchor: true,
    summary:
      "八位作者貼出〈Attention Is All You Need〉。自注意力取代循環，訓練可以平行。發表時幾乎沒有公眾，之後的語言模型、多模態與代理人幾乎都站在這個結構上。",
    source: "Vaswani 等，arXiv:1706.03762，2017年6月12日",
  },
  {
    id: "bert",
    y: 2018,
    m: 10,
    d: 11,
    dateLabel: "2018年10月11日",
    name: "BERT",
    chartLabel: "BERT",
    domain: "language",
    reach: 12,
    capability: 14,
    infrastructure: 14,
    civilization: 10,
    anchor: false,
    summary:
      "BERT 用雙向 Transformer 把一批語言任務同時拉高，並很快進到搜尋等產品。多數人沒有「我在用 BERT」的記憶，卻在搜尋結果裡碰到了它。",
    source: "Devlin 等，BERT，2018年10月",
  },
  {
    id: "gpt3",
    y: 2020,
    m: 5,
    d: 28,
    dateLabel: "2020年5月28日",
    name: "GPT-3",
    chartLabel: "GPT-3",
    domain: "language",
    reach: 14,
    capability: 20,
    infrastructure: 16,
    civilization: 16,
    anchor: false,
    summary:
      "GPT-3 不必為每個任務重新訓練，給幾個例子就會寫、譯、答。少樣本提示看起來像一種通用介面。它仍主要是 API 與論文，還沒有變成普通人的日常工具。",
    source: "Brown 等，arXiv:2005.14165，2020年5月28日",
  },
  {
    id: "alphafold",
    y: 2020,
    m: 11,
    d: 30,
    dateLabel: "2020年11月30日",
    name: "AlphaFold 2",
    chartLabel: "AlphaFold 2",
    domain: "science",
    reach: 12,
    capability: 24,
    infrastructure: 22,
    civilization: 24,
    anchor: true,
    summary:
      "AlphaFold 2 在 CASP14 把蛋白質摺疊這個約五十年的問題做到可實用。結構預測接著覆蓋幾乎全部已知蛋白質，2024 年得到諾貝爾化學獎。改寫的是科學基礎設施，不是聊天視窗。",
    source: "DeepMind，CASP14 結果，2020年11月30日",
  },
  {
    id: "dalle2",
    y: 2022,
    m: 4,
    d: 6,
    dateLabel: "2022年4月6日",
    name: "DALL·E 2",
    chartLabel: "DALL·E 2",
    domain: "generative",
    reach: 16,
    capability: 16,
    infrastructure: 8,
    civilization: 12,
    anchor: false,
    summary:
      "一句話可以換成一張還看得過去的圖，並開放排隊試用。它仍封閉、仍限額，但視覺文化第一次大規模感覺到：文字可以兌換圖像。",
    source: "OpenAI，DALL·E 2，2022年4月6日",
  },
  {
    id: "copilot",
    y: 2022,
    m: 6,
    d: 21,
    dateLabel: "2022年6月21日",
    name: "GitHub Copilot",
    chartLabel: "Copilot",
    domain: "agents",
    reach: 14,
    capability: 14,
    infrastructure: 16,
    civilization: 16,
    anchor: false,
    summary:
      "GitHub Copilot 對訂閱者正式開放。程式寫作是第一個把生成模型嵌進日常工具、並按月收費的主要職業。影響先落在一種勞動，而不是全體公眾。",
    source: "GitHub Copilot 正式版，2022年6月21日",
  },
  {
    id: "sd",
    y: 2022,
    m: 8,
    d: 22,
    dateLabel: "2022年8月22日",
    name: "Stable Diffusion",
    chartLabel: "穩定擴散",
    domain: "generative",
    reach: 20,
    capability: 16,
    infrastructure: 14,
    civilization: 16,
    anchor: false,
    summary:
      "Stable Diffusion 以開放權重釋出。圖像生成離開等待名單，進到個人電腦與無數衍生產品。版權、創作者生計，以及「什麼算一張圖」，同時被撕開。",
    source: "CompVis，Stable Diffusion 公開釋出，2022年8月22日",
  },
  {
    id: "chatgpt",
    y: 2022,
    m: 11,
    d: 30,
    dateLabel: "2022年11月30日",
    name: "ChatGPT",
    chartLabel: "ChatGPT",
    domain: "language",
    reach: 25,
    capability: 18,
    infrastructure: 22,
    civilization: 25,
    anchor: true,
    labelPlace: "left",
    summary:
      "模型不是當時的研究極限，介面卻是。數週之內，寫作、搜尋、功課與草稿的預設做法被改掉。文明影響主要來自有多少人改了自己做事的方式，不單是榜單分數。",
    source: "OpenAI，ChatGPT，2022年11月30日",
  },
  {
    id: "sora",
    y: 2024,
    m: 2,
    d: 15,
    dateLabel: "2024年2月15日",
    name: "Sora 示範",
    chartLabel: "Sora",
    domain: "generative",
    reach: 18,
    capability: 16,
    infrastructure: 6,
    civilization: 12,
    anchor: false,
    summary:
      "OpenAI 以示範影片公布 Sora。多數人當時還用不到，但「一段文字換成一段還站得住的影片」被放上公共議程。影響先發生在預期與影像產業的焦慮。",
    source: "OpenAI，Sora 發表，2024年2月15日",
  },
  {
    id: "nobel",
    y: 2024,
    m: 10,
    d: 8,
    dateLabel: "2024年10月8日",
    name: "諾貝爾承認 AI",
    chartLabel: "諾貝爾",
    domain: "science",
    reach: 18,
    capability: 2,
    infrastructure: 8,
    civilization: 20,
    anchor: false,
    summary:
      "物理獎給了霍普菲爾德與辛頓；次日化學獎的一半給了哈薩比斯與江珀的蛋白質結構預測。這不是新能力，是科學正典把已經發生的事寫進去。制度承認會改經費、教育，以及什麼算正經科學。",
    source: "諾貝爾物理獎 2024年10月8日；化學獎 10月9日",
  },
  {
    id: "computer-use",
    y: 2024,
    m: 10,
    d: 22,
    dateLabel: "2024年10月22日",
    name: "Claude 電腦操作",
    chartLabel: "電腦操作",
    domain: "agents",
    reach: 10,
    capability: 18,
    infrastructure: 12,
    civilization: 16,
    anchor: false,
    summary:
      "Claude 3.5 Sonnet 以公開測試提供電腦操作：看螢幕、移動游標、點擊、打字。它仍慢、仍會出錯，卻是前沿模型第一次以人使用電腦的方式開放給開發者。",
    source: "Anthropic，computer use 公開測試，2024年10月22日",
  },
  {
    id: "operator",
    y: 2025,
    m: 1,
    d: 23,
    dateLabel: "2025年1月23日",
    name: "Operator",
    chartLabel: "Operator",
    domain: "agents",
    reach: 14,
    capability: 18,
    infrastructure: 12,
    civilization: 18,
    anchor: false,
    summary:
      "OpenAI 向美國 Pro 用戶推出 Operator：電腦使用代理人在自己的瀏覽器裡點、打、捲動。它仍是研究預覽，地區有限。意義在產品形態——聊天之外，開始替你把網頁上的事做完。",
    source: "OpenAI，Introducing Operator，2025年1月23日",
  },
  {
    id: "grokbot",
    y: 2026,
    m: 8,
    d: 11,
    dateLabel: "2026年8月11日",
    name: "Grok Bot 公開測試",
    chartLabel: "Grok Bot",
    domain: "agents",
    reach: 20,
    capability: 20,
    infrastructure: 18,
    civilization: 22,
    anchor: true,
    labelPlace: "below",
    summary:
      "Grok Bot 從內部原型開放為公開測試。代理人從「示範會點螢幕」走到可以交付的產品：跨工具把任務做完，而不只是回答。到 2026 年 10 月它仍早期。分數評的是這一步的結構——軟體開始被交給去完成工作——不是所有職業已經被換掉。",
    source: "xAI，Grok Bot 公開測試，2026年8月11日",
  },
  {
    id: "agents-daily",
    y: 2027,
    m: 6,
    d: 1,
    dateLabel: "2027年中（預測）",
    name: "代理人成為工作起點",
    chartLabel: "工作起點",
    domain: "agents",
    reach: 22,
    capability: 18,
    infrastructure: 20,
    civilization: 22,
    anchor: true,
    forecast: true,
    confidence: "高",
    summary:
      "若多數知識工作從代理人開始，而不是從空白文件或搜尋框開始，使用方式會再改一次。這不是某一版模型的發布日，是 Grok Bot、Operator 這條線若走完的位置。",
    source: "情節，不是已公布的產品時程。出處用來對照現況，不替 2027 背書。",
    lesson: [
      "這一格問的不是「有沒有代理人產品」，而是知識工作的起點有沒有換掉。今天多數人仍從空白文件、收件匣或搜尋框開始，再把片段交給模型。若發生，指的是多數這類工作改成先把任務交出去，人負責交代目標、看結果、改方向。",
      "已經看得到的證據，和「已經發生」差很遠。Anthropic 用 Claude 的真實對話做經濟指數：使用集中在寫程式和技術寫作，而且多數仍是人機一起做，不是把整件事交出去。史丹佛 AI Index 記的是能力與採用在上升，不是某一種介面已經成為預設。信心高，高在方向看得到；2027 只是這條線若走完的位置。",
      "分數這樣拆：觸及高，是因為「若發生」時用的人會很多。能力沒有給滿，因為跨工具把事情做完，在 2025–2026 已經開始，不是全新的一類。鎖定高，是工作流一旦改了起點，就很難退回空白文件。後果高，是勞動過程改了，不是因為多了一個更會聊天的模型。",
      "怎麼反駁：若接下來代理人仍是側邊欄，打開才用，這一格就不該算發生，也不該事後把分數補上。",
    ],
    readings: [
      {
        title: "Stanford HAI，2025 AI Index",
        href: "https://hai.stanford.edu/ai-index/2025-ai-index-report",
        note: "史丹佛以數據整理能力、採用與社會影響。看趨勢，不看口號。",
      },
      {
        title: "Anthropic Economic Index（2025）",
        href: "https://www.anthropic.com/news/the-anthropic-economic-index",
        note: "用真實對話看 AI 現在做哪些工作。目前偏協作，還不是把工作交出去。",
      },
    ],
  },
  {
    id: "science-loop",
    y: 2028,
    m: 9,
    d: 1,
    dateLabel: "2028年（預測）",
    name: "科學發現的合作者",
    chartLabel: "科學合作",
    domain: "science",
    reach: 14,
    capability: 23,
    infrastructure: 20,
    civilization: 24,
    anchor: false,
    forecast: true,
    confidence: "中",
    summary:
      "若多個學科裡，系統能提出假設、設計實驗，再把結果收回來，科學發現的節奏會改。AlphaFold 解決的是結構；這一格說的是發現本身變成常規合作。",
    source: "情節，不是已公布的產品時程。年份是粗的。",
    lesson: [
      "AlphaFold 把「一個蛋白質長什麼樣」從實驗瓶頸變成可查。這一格更進一步：假設、實驗設計、結果收回來、下一個假設，若在多個學科變成常規合作，發現的節奏才算改掉。只做文獻摘要或作圖，不夠。",
      "2023 年《自然》的綜述把 AI 放進科學流程的每一步，也寫明還沒走完的部分。2025 年 Google 的 AI co-scientist，以及 2026 年發表在《自然》的後續，是多個代理人互相辯仮説、再送到實驗室檢驗的早期例子。那是工具進了實驗室，不是科學已經改由機器主持。",
      "信心中等，因為方法已有論文和實驗，研究制度還沒換。能力給得高，是新學會「提出可檢驗的假設」。觸及故意不高，因為用得到的仍是少數實驗室。",
      "怎麼反駁：若它停在搜尋文獻，沒有把新假設送進實驗並改下一輪，這一格就不算。",
    ],
    readings: [
      {
        title: "Wang 等，《自然》2023：AI 時代的科學發現",
        href: "https://www.nature.com/articles/s41586-023-06221-2",
        note: "綜述 AI 在假設、實驗與資料裡各自走到哪，以及還沒走到的地方。",
      },
      {
        title: "Google Research，AI co-scientist（2025）",
        href: "https://research.google/blog/accelerating-scientific-breakthroughs-with-an-ai-co-scientist",
        note: "多代理人產生假設，並在藥物與抗藥性題目上做過實驗室檢驗。是例子，不是常規。",
      },
    ],
  },
  {
    id: "general-learn",
    y: 2030,
    m: 6,
    d: 1,
    dateLabel: "2030年（預測）",
    name: "通用學習系統",
    chartLabel: "通用學習？",
    domain: "language",
    reach: 20,
    capability: 25,
    infrastructure: 24,
    civilization: 25,
    anchor: true,
    labelPlace: "left",
    forecast: true,
    confidence: "低",
    summary:
      "「能學會任何熟練的人學得會的新領域」若被做出來，影響會高過聊天介面。2030 只是實驗室公開時程裡常被提到的窗口，不是承諾。",
    source: "情節。信心低在年份與定義，不在「若發生會很大」。",
    lesson: [
      "這裡的定義很窄：系統能學會一個熟練的人學得會的新領域，而不是同一張考卷再高幾分。聊天變強、程式變強，都還不是這一格。",
      "2030 不是測量出來的。它是實驗室公開說法裡常出現的窗口。國際 AI 安全報告由 Bengio 主持，三十多國與聯合國、OECD、歐盟提名專家，整理的是通用系統現在做得到什麼、風險證據到哪，不替任何一家的年份背書。報告能當對照，不能當成行程表。",
      "四項都高，是因為這個定義本身就是斷裂：用法會跟著走，後面的系統與制度都會站上去。若你認為這個定義只是口號，正確的反對是整格拿掉，不是把總分平均調低。",
    ],
    readings: [
      {
        title: "International AI Safety Report（2025、2026）",
        href: "https://internationalaisafetyreport.org/publications",
        note: "Bengio 主持，百餘位專家執筆。寫能力與風險的證據，不寫某年一定達成。",
      },
      {
        title: "2025 年報告全文（arXiv）",
        href: "https://arxiv.org/abs/2501.17805",
        note: "同一份報告的公開文本，方便查它實際寫了什麼、沒寫什麼。",
      },
    ],
  },
  {
    id: "institutions",
    y: 2032,
    m: 6,
    d: 1,
    dateLabel: "2032年（預測）",
    name: "專業制度改寫",
    chartLabel: "制度改寫",
    domain: "agents",
    reach: 20,
    capability: 10,
    infrastructure: 16,
    civilization: 24,
    anchor: false,
    forecast: true,
    confidence: "低",
    summary:
      "若代理人做掉大量例行的認知工作，學校、證照、事務所與公司的分工會被迫改。這不是新模型，是制度跟上。",
    source: "情節。年份比技術節點更軟。",
    lesson: [
      "這一格沒有新模型。它問的是學校、證照、事務所和公司的分工，會不會因為例行的認知工作被做掉而改寫。工具換了、證書和組織還在，就不算。",
      "國際貨幣基金 2024 年的研究：先進經濟體因為工作偏認知，會更早感受到；暴露於 AI 不等於失業，和人互補時收入可以上升。Autor 在 NBER 的論點不是預言，而是一種可能：若 AI 把專家的判斷交到更多人手上，中階工作可以被重建；若判斷權更集中，制度會往另一邊改。兩種方向都算改寫。",
      "能力項故意低：制度改寫不需要機器再學會一種新技能。後果高，因為改的是誰有資格做決定。信心低，低在哪一年，不低在這件事一旦發生就很大。",
    ],
    readings: [
      {
        title: "IMF：生成式 AI 與工作的未來（2024）",
        href: "https://www.imf.org/en/Publications/staff-discussion-notes/Issues/2024/01/14/Gen-AI-Artificial-Intelligence-and-the-Future-of-Work-542379",
        note: "先進經濟體暴露較高。暴露不是失業名單，互補時收入也可以上升。",
      },
      {
        title: "David Autor，NBER 32140（2024）",
        href: "https://www.nber.org/papers/w32140",
        note: "論點是 AI 有可能把專業判斷擴到更多工作者。作者寫明這不是預測。",
      },
    ],
  },
  {
    id: "embodied",
    y: 2035,
    m: 6,
    d: 1,
    dateLabel: "2035年（預測）",
    name: "日常機器人",
    chartLabel: "日常機器人",
    domain: "agents",
    reach: 16,
    capability: 20,
    infrastructure: 14,
    civilization: 20,
    anchor: true,
    labelPlace: "below",
    forecast: true,
    confidence: "低",
    summary:
      "倉庫裡的機器人已經有了。這一格是通用的身體：家庭與一般工廠裡，機器能在沒有為每個動作寫腳本的情況下做事。",
    source: "情節。硬體週期比模型發布慢，年份的信心低。",
    lesson: [
      "倉庫和產線上的機器人已經在做事，而且多半是為每個動作寫好的。這一格是通用的身體：家裡和一般工廠裡，沒有為每個動作寫腳本也能做。演示影片不算。",
      "Open X-Embodiment 集合二十一個機構、二十二種機器人的操作數據，想訓練能跨機器遷移的策略。它說明研究方向是「一個政策、很多身體」，也說明現在仍主要在實驗室的操作任務，不是家庭。機器人基礎模型的綜述把缺口寫清楚：感知和規劃進步了，數據、安全與可靠度還沒有。",
      "後果低於通用學習：身體若可靠，改的是體力勞動的現場，不會自動改寫知識制度。觸及留在中間，是因為離開實驗室之前，用到的人不會多。",
    ],
    readings: [
      {
        title: "Open X-Embodiment（arXiv:2310.08864）",
        href: "https://arxiv.org/abs/2310.08864",
        note: "跨二十二種機器人的操作數據與 RT-X。實驗室裡的通用，不是家用機器人已經普及。",
      },
      {
        title: "Foundation Models in Robotics（arXiv:2312.07843）",
        href: "https://arxiv.org/abs/2312.07843",
        note: "綜述基礎模型進機器人的進展，以及數據、安全、即時控制這些還沒解的部分。",
      },
    ],
  },
];

export function impactOf(m: Milestone): number {
  return m.reach + m.capability + m.infrastructure + m.civilization;
}

export function yearOf(m: Milestone): number {
  const start = Date.UTC(m.y, 0, 1);
  const end = Date.UTC(m.y + 1, 0, 1);
  const t = Date.UTC(m.y, m.m - 1, m.d);
  return m.y + (t - start) / (end - start);
}

/** 2026-10-27，非閏年的第 300 天。 */
export const TODAY_YEAR = 2026 + 299 / 365;

export const YEAR_MIN = 1943;
export const YEAR_MAX = 2036;

for (const m of milestones) {
  for (const n of [m.reach, m.capability, m.infrastructure, m.civilization]) {
    if (n < 0 || n > 25 || !Number.isInteger(n)) {
      throw new Error(`bad score on ${m.id}`);
    }
  }
  if (impactOf(m) > 100) throw new Error(`impact overflow ${m.id}`);
  if (m.forecast && !m.confidence) throw new Error(`forecast needs confidence ${m.id}`);
  if (m.forecast && (!m.lesson?.length || !m.readings?.length)) {
    throw new Error(`forecast needs a lesson ${m.id}`);
  }
}
