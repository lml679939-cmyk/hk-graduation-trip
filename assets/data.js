/* ====== 香港畢業旅行 資料檔 ====== */

const ITINERARY = [
  {
    day: 1,
    date: "6/29（一）",
    status: "done",
    title: "台灣 → 港機 → 尖沙咀 → 旺角",
    route: "Hashtag B 蛋塔 → 九龍公園 → 華嫂冰室 → 星光大道 → 天星小輪 → 旺角宵夜",
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
        time: "15:30–15:45",
        act: "地鐵到尖沙咀 — 太子站 → 荃灣線（往中環）→ 尖沙咀站",
        note: ""
      },
      {
        time: "15:45–18:30",
        act: "<span class='route-label'>尖沙咀</span>Hashtag B → 九龍公園 → 華嫂冰室 → 星光大道 → 尖沙咀鐘樓 → 天星碼頭 → 天星小輪",
        places: [
          { name: "Hashtag B 蛋塔", desc: "下午茶（外帶）", url: "https://www.hashtag-b.com/pages/contact-us", lat: 22.2973, lng: 114.1739 },
          { name: "九龍公園", desc: "休息玩耍", url: "https://share.google/wVf7PRAx1WwY7ak87", lat: 22.3014, lng: 114.1699 },
          { name: "華嫂冰室", desc: "晚餐", url: "https://share.google/zNeadf2wUfntFD6sA", lat: 22.2975, lng: 114.1763 },
          { name: "星光大道", desc: "逛逛", url: "https://share.google/2vmdIRzpCDkVzruQf", lat: 22.2892, lng: 114.1715 },
          { name: "尖沙咀鐘樓", desc: "地標", url: "https://share.google/hTNGpBNjfOGwk7pBB", lat: 22.2939, lng: 114.1710 },
          { name: "天星碼頭", desc: "搭船", url: "https://share.google/J4R8eQNgS2g2lgH2i", lat: 22.2940, lng: 114.1686 }
        ],
        note: "<span class='meal-tag'>下午茶</span><a href='https://www.hashtag-b.com/pages/contact-us' target='_blank'>Hashtag B 蛋塔</a>（尖沙咀出爐時間 11:00 / 17:00）　<span class='meal-tag'>晚餐</span><a href='https://share.google/zNeadf2wUfntFD6sA' target='_blank'>華嫂冰室</a><br>＊富貴雪糕是流動餐車，可看有沒有"
      },
      {
        time: "18:30–19:30",
        act: "天星小輪看維港（會搭到中環）",
        note: "＊<a href='https://www.bigfang.tw/blog/post/starferry-hk' target='_blank'>天星小輪</a>票價：上層 $5.0 / 下層 $4.0"
      },
      {
        time: "19:30–20:00",
        act: "中環回旺角",
        note: "地鐵：中環站 → 荃灣線（往荃灣）→ 旺角站"
      },
      {
        time: "20:00",
        act: "旺角夜生活＋宵夜局",
        note: "<span class='meal-tag'>宵夜</span><a href='https://maps.app.goo.gl/Yzjhvo3Lfkn2ZSWV8' target='_blank'>標記樂園潮州粉麵菜館</a>"
      }
    ]
  },
  {
    day: 2,
    date: "6/30（二）",
    status: "done",
    title: "旺角 → 海洋公園 → 灣仔 → 太平山頂",
    route: "金華冰廳 → 海洋公園 → 甘牌燒鵝 → 太平山頂纜車",
    items: [
      {
        time: "8:30",
        act: "早餐集合（金華冰廳）",
        note: "想吃早餐的大廳集合<br><span class='meal-tag'>早餐</span><a href='https://share.google/NEMJHs7hTd1iPcCxs' target='_blank'>金華冰廳</a>"
      },
      {
        time: "9:50",
        act: "大廳集合，出發去海洋公園",
        note: "csy、Ting 一起集合"
      },
      {
        time: "10:30",
        act: "抵達海洋公園，玩一整天！",
        places: [
          { name: "海洋公園", desc: "玩一整天！", url: "https://www.klook.com/zh-TW/activity/23-ocean-park-hong-kong-hong-kong/", lat: 22.2478, lng: 114.1748 }
        ],
        note: "地鐵：太子站 → 荃灣線（往中環）→ 金鐘站 → 轉南港島線 → 海洋公園站<br>＊<a href='https://www.klook.com/zh-TW/activity/23-ocean-park-hong-kong-hong-kong/' target='_blank'>上網購票約 1,360 元台幣</a>；現場成人票約 2,030 元<br><span class='meal-tag'>午餐</span>自理"
      },
      {
        time: "18:00",
        act: "搭地鐵到灣仔吃晚餐",
        places: [
          { name: "甘牌燒鵝", desc: "晚餐", url: "https://www.bigfang.tw/blog/post/kams-roast-goose-hk", lat: 22.2771, lng: 114.1740 }
        ],
        note: "地鐵：海洋公園站 → 南港島線（往金鐘）→ 金鐘站 → 港島線（往柴灣）→ 灣仔站<br><span class='meal-tag'>晚餐</span><a href='https://www.bigfang.tw/blog/post/kams-roast-goose-hk' target='_blank'>甘牌燒鵝</a>（11:30 開，需現場抽號碼牌排隊）"
      },
      {
        time: "19:30–20:30",
        act: "到太平山頂看夜景",
        places: [
          { name: "太平山頂", desc: "俯瞰夜景", url: "https://www.thepeak.com.hk/", lat: 22.2709, lng: 114.1483 }
        ],
        note: "step① 叮叮車：走到柯布連道站 → 搭叮叮車（往西）→ 銀行街站<br>step② 纜車：走到中環花園道山頂纜車總站買票上山<br>＊纜車單程：港幣 $82"
      },
      {
        time: "22:00–23:00",
        act: "回飯店",
        note: "step① 小巴：山頂廣場（下層）→ <b>港島專線小巴 1 號線</b> → <b>畢打街（近中環站 D1 出口）</b><br>step② 地鐵：中環站 → 荃灣線（往荃灣）→ 太子站"
      }
    ]
  },
  {
    day: 3,
    date: "7/1（三）",
    status: "done",
    title: "旺角 → 淺水灣 → 赤柱 → 尖沙咀",
    route: "龍城冰室 → 旺角逛街 → 淺水灣（Caffè Parabolica）→ 赤柱 → 炯記燒味",
    items: [
      {
        time: "9:20",
        act: "早餐集合（龍城冰室）",
        note: "想吃早餐的大廳集合（csy、Ting 一起集合）<br><span class='meal-tag'>早餐</span><a href='https://share.google/Uc4ng9bzPeYzCkOPq' target='_blank'>龍城冰室</a>"
      },
      {
        time: "10:30–12:00",
        act: "<span class='route-label'>旺角逛街</span>彌敦道 & 朗豪坊 → 星際城市 → 女人街 → 波鞋街 → 花園街街市 → 旺角天橋 → 金魚街",
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
        note: ""
      },
      {
        time: "12:00–13:00",
        act: "搭車前往淺水灣",
        note: "step① 地鐵：旺角站 → 荃灣線（往金鐘）→ 金鐘站<br>step② 公車：金鐘站 B 出口 → 金鐘站（西座）巴士總站 → <b>城巴 260</b>（往赤柱村方向）→ 淺水灣海灘站"
      },
      {
        time: "13:00",
        act: "<span class='route-label'>淺水灣</span>Caffè Parabolica（午餐）→ 淺水灣泳灘 → 淺水灣影灣園（張愛玲）",
        places: [
          { name: "Caffè Parabolica", desc: "午餐", url: "https://www.caffeparabolica.com/", lat: 22.2380, lng: 114.1955 },
          { name: "淺水灣泳灘", desc: "逛逛看海", url: "https://maps.app.goo.gl/DyFbJnqbEMqsmHuY6", lat: 22.2362, lng: 114.1971 },
          { name: "淺水灣影灣園", desc: "張愛玲聖地", url: "", lat: 22.2375, lng: 114.1949 }
        ],
        note: "<span class='meal-tag'>午餐</span><a href='https://www.caffeparabolica.com/' target='_blank'>Caffè Parabolica</a>　⚠️ 人多請提前（最好兩週前）預約！"
      },
      {
        time: "15:30",
        act: "搭車去赤柱",
        note: "公車：淺水灣海灘站 → <b>城巴 260</b> / 城巴 6（往赤柱村方向）→ 海灣園; 赤柱村道站"
      },
      {
        time: "16:00",
        act: "<span class='route-label'>赤柱</span>赤柱大街逛逛",
        places: [
          { name: "赤柱大街", desc: "逛街", url: "https://maps.app.goo.gl/NYCcYuqtSYXEGVZJA", lat: 22.2186, lng: 114.2122 }
        ],
        note: ""
      },
      {
        time: "18:00",
        act: "落日飛車回中環 — 觀光城巴 H4 線",
        note: "走到赤柱警署（赤柱村道站）→ 搭<b>觀光城巴 H4 線</b> → 中環（香港摩天輪）<br>＊H4 票價：港幣 $49.7"
      },
      {
        time: "19:00–19:30",
        act: "搭地鐵到尖沙咀吃晚餐",
        places: [
          { name: "炯記燒味", desc: "晚餐", url: "https://www.google.com/maps/search/?api=1&query=炯記燒味+尖沙咀樂道", lat: 22.2985, lng: 114.1742 }
        ],
        note: "地鐵：中環站 → 荃灣線（往荃灣）→ 尖沙咀站<br><span class='meal-tag'>晚餐</span><a href='https://www.google.com/maps/search/?api=1&query=炯記燒味+尖沙咀' target='_blank'>炯記燒味（尖沙咀）</a>"
      },
      {
        time: "20:30–21:00",
        act: "搭地鐵回飯店",
        note: "地鐵：尖沙咀站 → 荃灣線（往荃灣）→ 旺角站"
      }
    ]
  },
  {
    day: 4,
    date: "7/2（四）",
    status: "done",
    title: "旺角 → 堅尼地城 → 中環 → 港機",
    route: "新興食家 → 堅尼地城（籃球場 / %Arabica / 海濱公園）→ 蓮香樓 → 中環 → 機場",
    items: [
      {
        time: "10:30",
        act: "大廳集合退房",
        note: "csy、Ting 一起集合"
      },
      {
        time: "11:00–14:30",
        act: "<span class='route-label'>堅尼地城</span>籃球場 → Winstons Coffee → 叮叮老香港辦館 → %Arabica → 海濱公園",
        places: [
          { name: "堅尼地城籃球場", desc: "拍照", url: "https://maps.app.goo.gl/C8nqCh4RsdAy2ybu8", lat: 22.2822, lng: 114.1281 },
          { name: "Winstons Coffee", desc: "拍照", url: "https://maps.app.goo.gl/AYHCsTEG4R5oVeTZA", lat: 22.2830, lng: 114.1285 },
          { name: "叮叮老香港辦館", desc: "逛街", url: "https://share.google/1veSx4awqklHaaas7", lat: 22.2831, lng: 114.1283 },
          { name: "% Arabica", desc: "喝咖啡", url: "https://maps.app.goo.gl/E3Wrsrhp8DJgbnng6", lat: 22.2837, lng: 114.1267 },
          { name: "海濱公園", desc: "看海", url: "https://maps.app.goo.gl/XRnt816NaUvuEhNa6", lat: 22.2820, lng: 114.1261 }
        ],
        note: "地鐵：太子站 → 荃灣線（往中環）→ 轉港島線 → 堅尼地城站<br><span class='meal-tag'>早午餐</span><a href='https://www.google.com/maps/search/?api=1&query=新興食家+堅尼地城' target='_blank'>新興食家</a>"
      },
      {
        time: "14:30–15:00",
        act: "搭叮叮車去中環",
        note: "叮叮車：北街站 → 搭叮叮車（往東）→ 禧利街站"
      },
      {
        time: "15:00–17:00",
        act: "<span class='route-label'>中環</span>蓮香樓（下午茶）→ 中環摩天輪 → 中環街市 → 半山扶梯 → Bakehouse",
        places: [
          { name: "蓮香樓", desc: "下午茶點心", url: "https://share.google/wDZJdZxrz3P1fg2zb", lat: 22.2875, lng: 114.1512 },
          { name: "中環摩天輪", desc: "拍照", url: "https://share.google/kJrZExUuAvi9z0FvV", lat: 22.2879, lng: 114.1549 },
          { name: "中環街市", desc: "逛逛", url: "https://share.google/GQgTSkWgCcqGntQ2M", lat: 22.2827, lng: 114.1547 },
          { name: "半山扶梯", desc: "搭扶梯", url: "", lat: 22.2825, lng: 114.1518 },
          { name: "Bakehouse", desc: "買伴手禮", url: "https://bobbytravel.tw/bakehouse/", lat: 22.2808, lng: 114.1527 }
        ],
        note: "<span class='meal-tag'>下午茶</span><a href='https://share.google/wDZJdZxrz3P1fg2zb' target='_blank'>蓮香樓</a>"
      },
      {
        time: "17:00",
        act: "去機場",
        note: "step① 叮叮車：機利文街站 → 搭叮叮車（往西）→ 文華里站<br>step② 巴士：林士街; 干諾道中站 → <b>城巴 A11</b>（往機場）→ 機場（1 號客運大樓）<br>＊城巴 A11：港幣 $41.9"
      },
      {
        time: "18:00",
        act: "抵達香港機場",
        note: "<b>20:10 飛機起飛</b>"
      },
      {
        time: "22:10",
        act: "抵達桃園機場（桃機香港都是一航）",
        note: "和爸媽說～我回來啦～"
      }
    ]
  }
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
    book: "+852 2392 683　可預約\n<a href='https://autoreserve.com/zh-hk/restaurants/bC9a1ifjvGuu4vATALFw' target='_blank'>線上訂位 →</a>",
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
    other: "流動餐車（外帶）⚠️ 近期爆出大腸菌群超標，請斟酌是否食用"
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
    book: "+852 2116 067　可預約\n<a href='https://inline.app/booking/-O31tPdJVLyUNiyBAg9F:inline-live-3?language=zh-hk' target='_blank'>線上訂位 →</a>",
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
    name: "赤柱中泰美食餐廳", cap: "yes",
    addr: "🚌 城巴 260 / 6（淺水灣沿線）→ 海灣園; 赤柱村道站，步行約 3–5 分鐘\n香港赤柱赤柱大街 52–56 號友誠樓",
    hours: "週一至六 07:00–17:30\n週日休息",
    review: "網友推：招牌泰式燒豬頸肉飯、當歸杞子清燉牛尾湯飯、芝士牛肉漢堡包、特色西多士（開心果 / 咖啡榛子口味）",
    book: "+852 2813 7998　可用 WhatsApp 詢問訂位",
    other: "CP 值高、份量足！"
  },
  {
    name: "Caffè Parabolica", cap: "yes",
    addr: "🚌 城巴 260 / 6 / 6X 或綠色小巴 40 / 40X → 淺水灣海灘站\n淺水灣淺水灣道 109 號地下 102–103 號",
    hours: "星期一至日 09:00–17:00",
    review: "網友推：Matcha Latte、Cloudy Latte、The English Muffin、Crabmeat Toast",
    book: "<a href='https://www.caffeparabolica.com/' target='_blank'>官方預約網站</a>　⚠️ 人多請提前（最好兩週前）預約！",
    other: "漂釀歐風早午餐咖啡廳；10% 服務費"
  },
  {
    name: "炯記燒味（尖沙咀）", cap: "yes",
    addr: "🚇 尖沙咀 / 尖東站（A1 出口 3 分鐘）\n尖沙咀樂道 19 號安順大廈地下 A 號舖",
    hours: "星期一至日 11:30–21:30",
    review: "網友推：鵝油撈麵、煙燻燒鵝、叉燒；沾酸梅醬必試。",
    book: "+852 2215 0268　不能訂位，需現場候位",
    other: "香港小眾燒臘口袋名單（在地人推薦）；高 CP 值"
  },
  {
    name: "通達食店", cap: "yes",
    addr: "🚇 油麻地站（A2 出口 1 分鐘）\n油麻地碧街 48 號地舖",
    hours: "星期一至日 07:00–21:00",
    review: "魚蛋兩種口味：咖哩魚蛋（不辣）、麻辣魚蛋（辣）",
    book: "不接受訂位，需現場候位",
    other: "必吃港式麻辣魚蛋與燒賣；禁帶外食飲料，內用低消港幣 $22；只收現金"
  },
  {
    name: "沖繩漁民食堂", cap: "yes",
    addr: "🚇 油麻地站（C 出口 5 分鐘）\n香港油麻地新填地街 151 號地下 E 舖",
    hours: "週一至六 11:30–21:30\n週日休息",
    review: "網友推烏冬和丼飯：日式照燒牛開丼、招牌卡邦尼烏冬系列、蜜糖照燒雞扒烏冬",
    book: "+852 5604 6046　猜應該需現場候位",
    other: "高 CP 值日式料理；可現金、八達通；支付寶付款人民幣港幣 1:1"
  },
  {
    name: "新興食家", cap: "yes",
    addr: "🚇 堅尼地城站（B 出口 3 分鐘）\n香港堅尼地城士美菲路美暉大廈地下 8 號鋪",
    hours: "星期一至日 03:00–16:00",
    review: "網友推：皇牌流沙包（全城最強爆漿奶黃）、咖哩金錢肚、蝦餃皇、蟹膏燒賣皇、蠔皇鮮竹卷、炸鮮奶",
    book: "+852 2816 0616　不接受訂位，需現場候位",
    other: "傳統港式早茶、最有名的深夜食堂（陳奕迅、林俊傑同款）；店員服務態度有兇但食物好吃"
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
