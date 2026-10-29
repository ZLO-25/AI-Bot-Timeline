const BEATS: { image: string; means: string }[] = [
  { image: "紙上的閘門", means: "麥卡洛克與皮茨把判斷寫成開關。能力已有，幾乎沒有人用到。" },
  { image: "帘子後面的紙條", means: "圖靈問的是如何分辨，不是做出一個會上班的東西。" },
  { image: "比成果大的夏日集會", means: "達特茅斯給了一個名字。名字留了下來，手藝沒有一起長出來。" },
  { image: "只會把布分成兩堆", means: "感知機走到單層就停。路看起來斷了，其實只是還不會把錯退回去。" },
  { image: "市集上排隊的說話櫃", means: "ELIZA。很多人覺得被懂。診所沒有換醫生。觸及可以很高，後果仍然低。" },
  { image: "把錯從最後一層退回去", means: "反向傳播。街上無感，後來每一座深的網路都靠它。這是鎖定，不是聲量。" },
  { image: "第六局，全城停了一週", means: "深藍。倒下的是西洋棋。方法是搜索和專用硬體，不是通用判斷。" },
  { image: "認布的眼睛把路改道", means: "AlexNet。錯誤率掉到老師傅不能再當它是興趣。街上的人很晚才感覺到。" },
  { image: "一間造假、一間抓假", means: "生成對抗網路。它們互相把對方逼真，市民不是服務對象。" },
  { image: "只拿到規則、自己下很多局", means: "AlphaGo。第二次安靜的輸。仍然是一種棋，不是所有判斷。" },
  { image: "不花哨的織機架子", means: "Transformer。後來的語言、圖像與帳，骨頭都是它。難拆，所以鎖定高。" },
  { image: "補上半句的讀件", means: "BERT。學者有用。市民的早晨沒變。" },
  { image: "給一個開頭就能接下去", means: "GPT-3。很大，仍待在工房。會用的人知道自己在用工具。" },
  { image: "不必再養很多年晶體", means: "AlphaFold。問的是折起來的結構。生物學的基礎設施換了，當時的排隊在另一邊。" },
  { image: "鎖着的畫室，和搬得動的棚", means: "DALL·E 證明做得到。穩定擴散改變誰做得了。後者的觸及與鎖定更高。" },
  { image: "接你寫到一半的那一行", means: "Copilot。起筆的人變少，抄寫這件事還沒消失。" },
  { image: "廚房裡的窗", means: "ChatGPT。五天裡很多人來試。改的是問題從哪裡開始，不是多會考試。" },
  { image: "看完就回去過原來的日子", means: "Sora 這類會動的畫面。新學會一種事，不足以改一天。" },
  { image: "獎頒給折線，不頒給窗", means: "諾貝爾化學獎落到 AlphaFold 這條線。後果有時要等一個儀式才被看見。" },
  { image: "不回答，去碰你的滑鼠", means: "電腦操作，以及之後願意把差事做完的 Operator、Grok Bot。從「答」走到「做」。" },
  { image: "淡墨、畫窄的街道", means: "還沒發生的年份只占正常寬度的一小段。那一年真的來了，再拉回一樣寬。" },
  { image: "沒有門牌的幾間房", means: "工作起點、科學合作、通用學習、制度改寫、日常機器人。分數是「若發生」，不是機率。" },
  { image: "城外那個只秤兩樣東西的攤", means: "模型時間。縱軸是答題有多好，橫軸是一題多少錢。左上更好。那張紙不決定港口換沒換規矩。" },
  { image: "答之前在暗處算很久", means: "思考。多花的計算進「能力」。事務所不會因為沉默本身就改鎖。" },
];

export function Story() {
  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <article className="flex flex-col gap-4">
        <h2 className="font-serif text-3xl text-fg">鹽埠</h2>
        <p className="text-base leading-relaxed text-fg">
          鹽埠靠三樣東西過活：帳、布、棋。帳記得出了什麼貨，布是城裡最穩的手藝，棋是冬天裡唯一還能讓人安靜坐下來的事。
        </p>
        <p className="text-base leading-relaxed text-fg">
          有一年，一個不出門的人在紙上畫了很多小閘門。閘門只有開和關。他說，若把夠多的閘門連在一起，也許能做出一種會判斷的東西。紙沒有離開那間屋子。碼頭上沒有人改自己的一天。
        </p>
        <p className="text-base leading-relaxed text-fg">
          後來有人把這件事說成一個遊戲：帘子後面坐著誰，你只能用紙條問。若你分不出是人還是一套規則，該怎麼辦。茶館當笑話聽。笑話傳開了，工作沒有改。
        </p>
        <p className="text-base leading-relaxed text-fg">
          再後來，城裡開了一次夏日的會。會比成果大。他們給一種還沒做出來的手藝起了名字，好像名字會讓手藝自己長出來。名字留了下來。手藝沒有。
        </p>
        <p className="text-base leading-relaxed text-fg">
          有人真的做了一排會自己改錯的閘門。它能把布分成兩堆，再多就不行。失敗很安靜，安靜到後來的人以為這條路斷了。
        </p>
        <p className="text-base leading-relaxed text-fg">
          市集上出現一個說話的櫃子。你說什麼，它就用你的話問回來，像在聽。排隊的人很多。看病的人回到診所，醫生還是原來的醫生。櫃子會讓人覺得被懂，不會把城改掉。
        </p>
        <p className="text-base leading-relaxed text-fg">
          真正被後來每一間工房依賴的，是一種教法。錯了，就把錯從最後一層退回第一層，讓每一層都知道自己該改哪裡。街上沒有人為這個教法停下來。可是從那以後，想再堆高那些閘門的人，都得先學會把錯退回去。抽掉它，後面的屋子會一起塌。
        </p>
        <p className="text-base leading-relaxed text-fg">
          棋盤先出事。一個只會搜索、只為一種棋造的櫃子，在第六局贏了冠軍。全城停了一週。倒下的是那種棋，不是判斷力。人們第一次同時看見輸，於是把「看見」誤當成「一切都變了」。
        </p>
        <p className="text-base leading-relaxed text-fg">
          布比棋慢。有一年，一雙新的眼睛看過山一樣多的布樣，把認錯的比例拉下一大截，拉到老師傅不能再說「這只是興趣」。染坊、圖樣、甚至城外運布的路，都從這一年改道。走在街上的人要很久以後才感覺到自己的衣服不一樣。
        </p>
        <p className="text-base leading-relaxed text-fg">
          同一段時間，城裡有兩間工房互相餵。一間專門做出看起來像真的東西，一間專門抓住假的。它們誰也不為市民服務，可是彼此把對方逼得更像。
        </p>
        <p className="text-base leading-relaxed text-fg">
          更大的棋盤上，櫃子不再背人類的慣用手。它只拿到規則，然後自己下了很多很多局。冠軍又輸了。這次人們比較安靜，因為他們已經輸過一次，知道安靜比歡呼難。
        </p>
        <p className="text-base leading-relaxed text-fg">
          然後出現的不是一種新布，是一架織機的架子。架子本身不花，也不會說話。花紋都是後來的人織上去的。怪的是，之後每一架能織長句子、長圖、長帳的機器，骨頭都是這一個架子。你可以換成更密的線，不能換成另一種骨頭。一根不太顯眼的木頭，比一面很亮的招牌更難拆。
        </p>
        <p className="text-base leading-relaxed text-fg">
          檔案館裡有人把城裡的舊紙頁餵給一個讀件的。它會補上你沒寫完的半句。學者覺得有用。市民的早晨沒有變。
        </p>
        <p className="text-base leading-relaxed text-fg">
          工房把那個讀件養得極大。你給它一個開頭，它能把很多種文書接下去。它還是待在工房。會用它的人，知道自己在用一件工具。
        </p>
        <p className="text-base leading-relaxed text-fg">
          有一段時間，櫃子答之前會先在暗處算很久。城裡的人把這段沉默叫成思考，並以為事務所會因此改掉。沉默只是一種新學會的做法。事務所的門沒有為了沉默而換鎖。
        </p>
        <p className="text-base leading-relaxed text-fg">
          生物學的櫃子不在市集。它讓人不必再為了一條折起來的線，養晶體養很多年。線的形狀變成可以問的。實驗室的做法換了。城裡的人當時還在為別的櫃子排隊，沒有注意到這件事更大。
        </p>
        <p className="text-base leading-relaxed text-fg">
          畫也離開了筆。一間工房的畫很貴，門是鎖著的。另一間把方法放進任何人搬得動的棚子。貴的那間證明做得到。棚子改變了誰做得了。
        </p>
        <p className="text-base leading-relaxed text-fg">
          帳冊上多了一隻手，接你寫到一半的那一行。抄寫沒有消失，只是起筆的人變少了。
        </p>
        <p className="text-base leading-relaxed text-fg">
          然後是一扇窗。不是更會補句子。是句子的起點換了地方。從前問事，是從一張白紙、一個搜尋、一個熟人或一間辦公室開始。窗打開之後，很多人的第一句話對着窗說。五天裡，廣場擠滿了來試的人。他們沒有學會新的科學。他們改了問題從哪裡開始。
        </p>
        <p className="text-base leading-relaxed text-fg">
          這件事吵得很兇，因為每個人都看見了。看見，和拆不掉，不是同一件事。會說話的窗被看見。織機的架子幾乎沒有被看見。折線的櫃子在實驗室裡。三件事情的大小，不按音量排。
        </p>
        <p className="text-base leading-relaxed text-fg">
          會動的畫從一句話裡走出來。人站着看完，然後回去用原來的方式過日子。新學會的一種事，不一定改寫一天。
        </p>
        <p className="text-base leading-relaxed text-fg">
          獎最後頒給折線，不是頒給窗。城這才回頭看實驗室。有些後果要等一個不相干的儀式，才被當成後果。
        </p>
        <p className="text-base leading-relaxed text-fg">
          櫃子開始不回答。它去碰你的滑鼠，打開你的抽屜，把你交代的那一小段路走完。又有一個願意把整件差事做完再回來。它們仍是少數人的早晨。方向已經從「答」走到「做」。還沒走到的是：大多數早晨是不是都從把差事交出去開始。
        </p>
        <p className="text-base leading-relaxed text-fg">
          城圖的右邊用更淡的墨，而且畫得很窄。不是那些年比較短。是那些房間還沒蓋。帳房規定：沒蓋的年份只占已蓋年份的一小段寬度，免得一張還沒發生的圖，把已經發生的街道擠出紙外。等到那一年真的來了，街道恢復跟過去一樣寬。
        </p>
        <p className="text-base leading-relaxed text-fg">
          淡墨裡有幾間還沒有門牌的房間。一間是大多數知識工作的起點，人不再從白紙開始。一間在實驗室裡，下一輪假設會被提出、送去做、再拿回來改。一間最大，門牌上只有問號：若裡面真有一個學徒，能像人一樣學會一份它沒被專門訓練過的手藝，後面的房子都得重建。年份最不穩。不穩的是哪一年，不是「若真有這間，城會不會動」。還有一間沒有新工具，學校、執照和事務所的牆要重砌。工具換了而證書還在，這間就不算蓋好。最後一間有身體，不是倉庫裡為每個動作寫好腳本的手臂，是家裡和普通廠房裡沒有腳本也能做事的那種。它改的是現場，不是誰有資格下判斷。
        </p>
        <p className="text-base leading-relaxed text-fg">
          城外還有一個攤。攤主不評這座城有沒有被改寫。他只把兩樣東西放在同一張紙上：一套題答得有多好，以及答完一題要花多少錢。越靠左上越好。一個幾乎一樣會答、卻便宜很多的夥計，在這張紙上很亮。亮，只表示你今天會叫哪一個。不表示港口換了規矩。
        </p>
        <p className="text-base leading-relaxed text-fg">
          帳房的人把冊子合上。他沒有宣布誰最聰明。他說，城裡的人一直在問最後出現的那個會不會說話。帳冊邊上空着的，是另外四件事：有多少人真的把一天交進去了，它是不是學會了一種從前沒有的事，後來的屋子是不是都靠它撐着，以及知識、活計或規矩有沒有因此改寫。音量最大的，常常只答了第一件。
        </p>
      </article>

      <section className="border-t border-line pt-8">
        <h2 className="font-serif text-3xl text-fg">故事結束之後</h2>
        <p className="mt-3 text-base leading-relaxed text-fg">
          鹽埠不是一座真的城。它是這張圖。閘門、櫃子、織機、窗和淡墨，說的是人工智慧裡那些會被記下來的斷裂，不是每一次模型換代。分數仍然是編輯評估：同一把尺，方便比較，也方便反對。它不是智商，也不是考卷。
        </p>
        <h3 className="mt-8 text-sm font-semibold text-amber">帳冊邊上的四件事</h3>
        <dl className="mt-3 flex flex-col gap-4">
          <div>
            <dt className="text-base font-semibold text-fg">有多少人真的把一天交進去</dt>
            <dd className="mt-1 text-base leading-relaxed text-muted">觸及。排隊、五天擠滿廣場，是觸及。熱門不等於觸及，要有人真的用到。</dd>
          </div>
          <div>
            <dt className="text-base font-semibold text-fg">是不是學會一種從前沒有的事</dt>
            <dd className="mt-1 text-base leading-relaxed text-muted">能力。把布分成兩堆、把錯退回去、認出路改道的眼睛、答之前先在暗處算，各是一種新事。同一種事做得更準，這項不會再跳。</dd>
          </div>
          <div>
            <dt className="text-base font-semibold text-fg">後來的屋子是不是都靠它撐着</dt>
            <dd className="mt-1 text-base leading-relaxed text-muted">鎖定。織機架子幾乎不說話，可是抽掉它，後面的長句子、長圖、長帳一起塌。亮的招牌可以很吵，仍然拆得掉。</dd>
          </div>
          <div>
            <dt className="text-base font-semibold text-fg">知識、活計或規矩有沒有改寫</dt>
            <dd className="mt-1 text-base leading-relaxed text-muted">後果。折線不必再養晶體，是科學的基礎設施。窗換掉問題的起點，是用法。執照和事務所的牆要重砌，才是制度。看完會動的畫就回去過原來的日子，後果就不高。</dd>
          </div>
        </dl>
        <h3 className="mt-8 text-sm font-semibold text-amber">隱喻分別對上什麼</h3>
        <dl className="mt-3 flex flex-col gap-4">
          {BEATS.map((beat) => (
            <div key={beat.image} className="border-t border-line pt-3">
              <dt className="text-base font-semibold text-fg">{beat.image}</dt>
              <dd className="mt-1 text-base leading-relaxed text-muted">{beat.means}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
