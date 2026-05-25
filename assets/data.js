/* ====== 香港畢業旅行 資料檔 ======
   之後補 Day 3、Day 4 時，把 itinerary 裡 status:"soon" 的物件
   改成 status:"done" 並填入 route / items 即可。 */

const ITINERARY = [
  {
    day: 1,
    date: "6/29（一）",
    status: "done",
    title: "台灣 → 港機 → 旺角",
    route: "金華冰廳 → 彌敦道 & 朗豪坊 → 女人街 → 龍城冰室 → 波鞋街 → 花園街街市 → 旺角天橋 → 金魚街",
    items: [
      {
        time: "8:00",
        act: "桃機集合（桃機、香港都是第一航廈）",
        note: "<b>11:00 飛機起飛</b>"
      },
      {
        time: "13:05",
        act: "抵達香港機場",
        note: "10:20 璇、何已到"
      },
      {
        time: "14:00",
        act: "帶著行李去搭機場巴士 — 城巴 NA21 到 <b>西洋菜南街站</b>",
        note: "A21 票價：<b>$39.3</b>　時間：約 1 小時"
      },
      {
        time: "15:00",
        act: "飯店 Check in 放行李",
        note: "飯店在 <b>太子站</b>"
      },
      {
        time: "15:30",
        act: "飯店大廳集合～開始旅程！",
        note: "csy、Ting 一起集合"
      },
      {
        time: "15:30後",
        act: "<span class='route-label'>總體路線</span>金華冰廳（下午茶）→ 彌敦道 & 朗豪坊 → 女人街 → 龍城冰室（晚餐）→ 波鞋街 → 花園街街市 → 旺角天橋 → 金魚街",
        places: [
          { name: "彌敦街", desc: "逛街拍照", url: "https://maps.app.goo.gl/oXMLDvb3TTEYq8bw6", lat: 22.3193, lng: 114.1694 },
          { name: "朗豪坊", desc: "逛街", url: "https://maps.app.goo.gl/UXAMt8hEFEqzsKAV6", lat: 22.3185, lng: 114.1686 },
          { name: "星際城市", desc: "逛街（ccd）", url: "https://maps.app.goo.gl/uLRxfnQA75uQigie9", lat: 22.3156, lng: 114.1677 },
          { name: "女人街", desc: "逛街", url: "https://maps.app.goo.gl/7cG7eiiAhFapycny6", lat: 22.3191, lng: 114.1704 },
          { name: "波鞋街", desc: "逛街（一堆鞋子）", url: "https://maps.app.goo.gl/jKWszgM3X1z68SFq7", lat: 22.3190, lng: 114.1693 },
          { name: "花園街", desc: "逛街（像菜市場）", url: "https://maps.app.goo.gl/zv3cSbNNAJrxGnt98", lat: 22.3253, lng: 114.1723 },
          { name: "旺角天橋", desc: "拍照", url: "", lat: 22.3222, lng: 114.1699 },
          { name: "金魚街", desc: "逛街拍照（有些不能拍）", url: "https://maps.app.goo.gl/EBmw8ZqsBJwWogzZ7", lat: 22.3232, lng: 114.1711 }
        ],
        note: "<span class='meal-tag'>下午茶</span><a href='https://share.google/NEMJHs7hTd1iPcCxs' target='_blank'>金華冰廳</a>　<span class='meal-tag'>晚餐</span><a href='https://share.google/Uc4ng9bzPeYzCkOPq' target='_blank'>龍城冰室</a>　<span class='meal-tag'>飲料</span><a href='https://maps.app.goo.gl/BjchPzyRvegP8Pi56' target='_blank'>林香檸</a>"
      },
      {
        time: "19:30",
        act: "自由行（以下參考）：<br>① <b>打泰拳</b> — Ole Muay Thai & Fitness 或 RMG Muaythai & Fitness Gym（距飯店步行 5 分鐘內）<br>② <b>落日飛車</b> — 去中環六號碼頭搭乘，最推 <a href='https://www.discoverhongkong.com/tc/deals/hong-kong-night-bus-tour.html' target='_blank'>H2K 夜遊巴士</a><br>③ 回飯店把公設用到底",
        note: ""
      },
      {
        time: "22:00",
        act: "宵夜局（想吃就來吃，不吃也沒差）",
        note: "<span class='meal-tag'>宵夜</span><a href='https://maps.app.goo.gl/' target='_blank'>標記樂園潮州粉麵菜館</a>"
      }
    ]
  },
  {
    day: 2,
    date: "6/30（二）",
    status: "done",
    title: "旺角 → 灣仔 → 堅尼地城 → 尖沙咀 → 旺角",
    route: "甘牌燒鵝 → 堅尼地城（籃球場 / 咖啡 / %Arabica / 海濱）→ 尖沙咀（蛋塔 / 華嫂冰室 / 星光大道 / 天星小輪）→ 太平山頂",
    items: [
      {
        time: "10:30",
        act: "大廳集合",
        note: "9:00 要吃早餐的大廳集合（csy、Ting 一起集合）"
      },
      {
        time: "11:00",
        act: "去灣仔吃午餐，然後搭叮叮車過去堅尼地城",
        note: "<span class='meal-tag'>午餐</span><a href='https://www.bigfang.tw/blog/post/kams-roast-goose-hk' target='_blank'>甘牌燒鵝</a>（11:30 開，建議開門前過去）"
      },
      {
        time: "13:00",
        act: "<span class='route-label'>堅尼地城</span>籃球場 → 咖啡館 → 叮叮老香港辦館 → %Arabica → 海濱公園",
        places: [
          { name: "堅尼地城籃球場", desc: "拍照", url: "https://maps.app.goo.gl/C8nqCh4RsdAy2ybu8", lat: 22.2822, lng: 114.1281 },
          { name: "Winstons Coffee", desc: "拍照", url: "https://maps.app.goo.gl/AYHCsTEG4R5oVeTZA", lat: 22.2830, lng: 114.1285 },
          { name: "叮叮老香港辦館", desc: "逛街", url: "https://share.google/1veSx4awqklHaaas7", lat: 22.2831, lng: 114.1283 },
          { name: "% Arabica", desc: "喝咖啡", url: "https://maps.app.goo.gl/E3Wrsrhp8DJgbnng6", lat: 22.2837, lng: 114.1267 },
          { name: "海濱公園", desc: "看海", url: "https://maps.app.goo.gl/XRnt816NaUvuEhNa6", lat: 22.2820, lng: 114.1261 }
        ],
        note: ""
      },
      {
        time: "15:00",
        act: "<span class='route-label'>尖沙咀</span>Hashtag B → 九龍公園 → 華嫂冰室 → 星光大道 → 尖沙咀鐘樓 → 天星小輪 → 維多利亞港",
        places: [
          { name: "九龍公園", desc: "休息玩耍", url: "https://share.google/wVf7PRAx1WwY7ak87", lat: 22.3014, lng: 114.1699 },
          { name: "星光大道", desc: "逛逛", url: "https://share.google/2vmdIRzpCDkVzruQf", lat: 22.2892, lng: 114.1715 },
          { name: "尖沙咀鐘樓", desc: "地標", url: "https://share.google/hTNGpBNjfOGwk7pBB", lat: 22.2939, lng: 114.1710 },
          { name: "天星碼頭", desc: "搭船", url: "https://share.google/J4R8eQNgS2g2lgH2i", lat: 22.2940, lng: 114.1686 },
          { name: "維多利亞港", desc: "坐船經過", url: "" }
        ],
        note: "<span class='meal-tag'>下午茶</span><a href='https://www.hashtag-b.com/pages/contact-us' target='_blank'>Hashtag B 蛋塔</a>　<span class='meal-tag'>晚餐</span><a href='https://share.google/zNeadf2wUfntFD6sA' target='_blank'>華嫂冰室</a><br>＊富貴雪糕是流動餐車，可看有沒有<br>＊<a href='https://www.bigfang.tw/blog/post/starferry-hk' target='_blank'>天星小輪</a>票價：上層 $5.0 / 下層 $4.0"
      },
      {
        time: "19:30",
        act: "坐船抵達中環碼頭，太平山頂搭纜車",
        note: "＊從中環碼頭到太平山搭公車 <b>22S</b>（至紅棉路；香港壁球中心外）<br>＊太平山頂纜車於 <b>中環花園道山頂纜車總站</b> 搭車"
      }
    ]
  },
  { day: 3, date: "7/1（三）", status: "soon", title: "", route: "", items: [] },
  { day: 4, date: "7/2（四）", status: "soon", title: "", route: "", items: [] }
];

const RESTAURANTS = [
  {
    name: "龍城冰室（旺角）", cap: "yes",
    addr: "🚇 旺角站（D2 出口 1 分鐘）\n旺角亞皆老街 65 號旺角新之城地舖",
    hours: "星期一至日 06:30–02:00",
    review: "網友推：招牌美國西冷牛扒、黑松露蝦球炒滑蛋套餐、鐵板牛柳絲炒公仔麵、微辣肥牛拼鮮蝦、特厚花生醬西多士",
    book: "+852 4614 1840　不接受訂位，需現場排隊",
    other: "只收現金"
  },
  {
    name: "Hashtag B 蛋塔", cap: "no",
    addr: "🚇 旺角站 / 尖沙咀站\n尖沙咀分店：加拿芬道 49 號夏蕙樓地下 C 舖\n旺角分店：西洋菜南街 1N 號兆萬中心地下 G1、G2 號舖",
    hours: "星期一至日 08:00–22:00",
    review: "vs. Bakehouse：Hashtag B 蛋塔較大、餡料多、更滿足；招牌拿破崙焦糖千層撻塔皮較脆、甜度高；開心果千層撻可能有點苦。",
    book: "現場排隊",
    other: "尖沙咀店出爐時間每天 11:00、17:00（外帶）"
  },
  {
    name: "金華冰廳", cap: "yes",
    addr: "🚇 旺角站（B3 出口 2 分鐘）\n香港旺角弼街 45–47 號",
    hours: "星期一至日 06:30–22:00",
    review: "號稱香港第一菠蘿油，冰火菠蘿油評價兩極，可評估要不要點。",
    book: "+852 2392 683　可預約",
    other: "每人有低消。只想吃菠蘿油買外帶比較快；建議在門口先想好要點什麼。"
  },
  {
    name: "標記樂園潮州粉麵菜館", cap: "yes",
    addr: "🚇 旺角站（E2 出口 4 分鐘）\n香港旺角通菜街 12–14 號",
    hours: "星期一至日 17:00–03:30",
    review: "張舜堯：推！自己會和朋友吃的店。網友推：潮州煎蠔仔餅、即泡潮州蠔仔粥、辣炒瓜子。",
    book: "+852 6243 3843　應該可預約",
    other: "座位很多，在女人街旁邊，適合宵夜局"
  },
  {
    name: "澳門茶餐廳", cap: "yes",
    addr: "🚇 尖沙咀站\n香港尖沙咀樂道",
    hours: "週一至四、日 07:00–18:00\n週五、六 07:00–21:30",
    review: "何姸穎：揚州炒飯非常好吃。網友推：豬扒包、澳門焗豬扒飯、烤乳鴿、三絲炒公仔麵、鮮茄牛肉燴意粉、葡式鴛鴦蝦炒飯、奶茶、美祿。",
    book: "+852 2366 8148　不能訂位，需現場候位",
    other: "餐廳蠻大通常不用等太久；蛋塔 10 點後才出爐；可用 AlipayHK、支付寶、現金、八達通、微信。"
  },
  {
    name: "Bakehouse", cap: "no",
    addr: "🚇 尖沙咀站 / 中環站（C 出口 10 分鐘）\n尖沙咀漢口道 44 號 / 中環蘇豪士丹頓街 5 號",
    hours: "週一 08:00–15:30\n週二至日 08:00–21:00",
    review: "網友：司康普普（不用試）；酸種蛋撻 👍👍！",
    book: "+852 9667 3393　買超過 24 個可先 WhatsApp 訂",
    other: "可以盒裝帶回台灣（外帶）"
  },
  {
    name: "華嫂冰室（尖沙咀）", cap: "yes",
    addr: "🚇 尖沙咀 / 尖東站（B2 出口 3 分鐘）\n尖沙咀加連威老道 10 號地下",
    hours: "星期一至日 08:00–22:00",
    review: "網友推：番茄香煎豬扒雞翼麵、招牌菠蘿包、招牌蛋沙律多士、豬扒雞翼番茄通粉、招牌芝士鹹牛肉蛋豬仔包、冰花奶茶。雷點：起司鹹牛肉多士（真的很鹹）。",
    book: "+852 2259 9318　主要現場排隊",
    other: "⚠️ 到現場先抽號碼牌；掃碼點餐、餐後櫃檯報桌號結帳；不提供開水、餐巾紙（一包3元）；桌側抽屜有餐具跟白糖。"
  },
  {
    name: "富豪雪糕（尖沙咀）", cap: "no",
    addr: "🚇 尖沙咀 / 尖東站（L5 出口 6 分鐘）\n尖沙咀天星碼頭對出巴士站（各區流動）",
    hours: "無固定營業時間",
    review: "No.1 香滑軟雪糕（香草口味）",
    book: "現場排隊",
    other: "流動餐車（外帶）"
  },
  {
    name: "% ARABICA", cap: "yes",
    addr: "🚇 堅尼地城站（A 出口 7 分鐘）\n堅尼地城爹核士街 1 號裕福大廈 4 號舖連閣樓",
    hours: "週一至五 08:30–19:00\n週六、日及假日 08:30–20:00",
    review: "網友推：soft cream 霜淇淋",
    book: "+852 2326 4578　不能訂位，現場候位",
    other: "二樓視野好，海景第一排座位不多（約三組），需等候；廁所只有一間。"
  },
  {
    name: "勝香園大排檔", cap: "no",
    addr: "🚇 中環站\n香港中環美輪街 2 號",
    hours: "週一至六 08:00–15:45\n週日休息",
    review: "用餐環境普通、番茄系列都很濃。網友推：番茄鮮牛肉蛋公仔麵、蕃茄牛肉煎蛋腸仔通粉、牛油檸檬汁蜜糖脆脆。",
    book: "+852 2544 8368　不能訂位，現場候位",
    other: "只收現金；室外雅座（街邊美食）（座位不多，13 人有困難）"
  },
  {
    name: "祥興記上海生煎包", cap: "no",
    addr: "🚇 中環站（D2 出口 8 分鐘）/ 尖沙咀站（A1 出口 2 分鐘）\n中環擺花街 48 地下 / 尖沙咀樂道 48 號地下 6A 號舖",
    hours: "星期一至日 09:00–21:00",
    review: "網友推：生煎包必點 👍（會爆湯汁、燙口小心 ⚠️）；前三名：黃金蟹粉、黑松露、招牌生煎包。雷點：足四兩蟹黃麵（超油）。",
    book: "+852 2690 0725　可用 WhatsApp 下單自取",
    other: "中環店室內空間不大，約 14 個高腳椅座位（除非包場）"
  },
  {
    name: "蓮香樓", cap: "yes",
    addr: "🚇 上環站（A2 出口 5 分鐘）/ 中環站（D1 出口 9 分鐘）\n上環德輔道中 249 號地下 9、10 號舖 1、2 樓",
    hours: "星期一至日 06:00–00:00\n早市 06:00–10:00（點心）\n午市 11:00–16:00\n晚市 18:00–22:00（粵菜正餐）",
    review: "友人：小貴但必吃！網友推：蟹籽燒賣皇、鮮蝦滑腸粉 👍👍、蓮香蝦餃皇、奶皇流沙包、豉汁蒸鳳爪、椰皇燕窩燉鮮奶、蜜汁叉燒包、懷舊馬拉糕、臘味蘿蔔糕、懷舊糯米雞…",
    book: "+852 2116 067　可預約",
    other: "用餐區在 2 樓；港式 SOP：第一泡茶用來沖燙餐具。小點25/中點30/大點35/特點38/頂點42。"
  },
  {
    name: "甘牌燒鵝", cap: "yes",
    addr: "🚇 灣仔站（A2 出口 4 分鐘）\n香港灣仔軒尼詩道 226 號",
    hours: "星期一至日 11:30–21:30",
    review: "網友推：燒鵝下庄、化皮乳豬、肥燶叉燒、太子成撈麵、甘牌燒鵝瀨粉。",
    book: "+852 2520 1110　不接受預約，現場抽號碼牌（熱門時段排 1 小時很正常）",
    other: "價格高、單點貴；午市套餐便宜但份量小；建議開門前、下午三四點或外帶；多為 2 人座。"
  },
  {
    name: "維記 cafe", cap: "?",
    addr: "🚇 堅尼地城站（C 出口）\n香港堅尼地城科士街 34 號",
    hours: "星期一至日 06:30–23:00",
    review: "",
    book: "",
    other: ""
  },
  {
    name: "林香檸", cap: "?",
    addr: "飲料店，應該很多地方都有",
    hours: "",
    review: "",
    book: "",
    other: ""
  }
];

const SURVEY = [
  { name: "鍾宜珊", spicy: "是", avoid: "香菜、苦瓜、茄子", note: "" },
  { name: "陳禹璇", spicy: "否", avoid: "內臟、苦瓜、茄子、生食", note: "不要選只賣辣物的餐廳就好，我會自己挑能吃的" },
  { name: "吳孟剛", spicy: "微辣可", avoid: "羊肉、生食、內臟、苦瓜、茄子、芋頭、香菇、筍乾", note: "只要有其他我能吃的菜就可以" },
  { name: "林苡婕", spicy: "是", avoid: "香菜、芋頭", note: "" },
  { name: "葉祐誠", spicy: "是", avoid: "芒果、魚鬆（皆為過敏）", note: "" },
  { name: "陳思妤", spicy: "是", avoid: "羊肉、茄子、苦瓜、紅蘿蔔、甜椒、鹹芋頭", note: "不要去羊肉專賣店就好" },
  { name: "陳柏村", spicy: "是", avoid: "芋頭", note: "" },
  { name: "張舜堯", spicy: "否", avoid: "—", note: "不要選只賣辣物的餐廳就好，我會自己挑能吃的" },
  { name: "徐睿君", spicy: "微辣可", avoid: "香菜、芹菜、黑橄欖、鹹芋頭、冬瓜、榴槤、茼蒿、苜蓿芽", note: "可以點，我不要吃到就好" },
  { name: "何姸穎", spicy: "微辣可", avoid: "香菇、水蓮、空心菜、蕃茄（可蕃茄湯）、香菜、芹菜、白蘿蔔、火龍果、青椒、彩椒、鳳梨、酸的、鹹芋頭、茄子、苦瓜、榴槤、筍乾、茼蒿、四季豆、冬瓜（入菜）、南瓜", note: "不用理我，我會自己找到能吃的" },
  { name: "劉映彤", spicy: "微辣可", avoid: "巧克力、各種內臟、鹹芋頭", note: "別管我，我會自己挑掉" },
  { name: "張旭廷", spicy: "是", avoid: "沒差", note: "" }
];
